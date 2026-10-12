package com.glowcart.integration;

import com.glowcart.dto.request.PlaceOrderRequest;
import com.glowcart.entity.*;
import com.glowcart.exception.InsufficientStockException;
import com.glowcart.repository.*;
import com.glowcart.service.OrderService;
import jakarta.persistence.OptimisticLockException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class OversellIntegrationTest {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderRepository orderRepository;

    private Product flashSaleProduct;
    private final List<User> buyers = new ArrayList<>();
    private static final int INITIAL_STOCK = 10;
    private static final int CONCURRENT_BUYERS = 200;

    @BeforeEach
    void setUp() {
        orderRepository.deleteAll();
        cartRepository.deleteAll();
        productRepository.deleteAll();
        categoryRepository.deleteAll();
        brandRepository.deleteAll();
        userRepository.deleteAll();
        buyers.clear();

        Category category = categoryRepository.save(Category.builder()
                .name("Limited Drops")
                .slug("limited-drops")
                .description("Exclusive beauty drops")
                .build());

        Brand brand = brandRepository.save(Brand.builder()
                .name("Nykaa Exclusive")
                .slug("nykaa-exclusive")
                .build());

        // Initial inventory is strictly 10 units with @Version optimistic lock starting at 0
        flashSaleProduct = productRepository.save(Product.builder()
                .name("Flash Sale Serum 10 Units Only")
                .slug("flash-sale-serum")
                .price(BigDecimal.valueOf(99.00))
                .stockQuantity(INITIAL_STOCK)
                .category(category)
                .brand(brand)
                .active(true)
                .version(0L)
                .build());

        // Prepare 200 distinct users with carts holding 1 unit each
        for (int i = 0; i < CONCURRENT_BUYERS; i++) {
            User user = userRepository.save(User.builder()
                    .email("buyer_" + i + "@nykaafans.com")
                    .fullName("Buyer " + i)
                    .password("secret123")
                    .role(Role.CUSTOMER)
                    .build());
            buyers.add(user);

            Cart cart = Cart.builder()
                    .user(user)
                    .items(new ArrayList<>())
                    .build();

            CartItem item = CartItem.builder()
                    .cart(cart)
                    .product(flashSaleProduct)
                    .quantity(1)
                    .build();

            cart.getItems().add(item);
            cartRepository.save(cart);
        }
    }

    @Test
    @DisplayName("200 concurrent buyers competing for 10 units: Exactly 10 succeed, 190 fail with 409 conflict, final stock == 0")
    void testConcurrentFlashSale_NoOverselling() throws InterruptedException {
        ExecutorService executor = Executors.newFixedThreadPool(50);
        CountDownLatch startGun = new CountDownLatch(1);
        CountDownLatch finishLatch = new CountDownLatch(CONCURRENT_BUYERS);

        AtomicInteger successfulOrders = new AtomicInteger(0);
        AtomicInteger rejectedConflicts = new AtomicInteger(0);
        AtomicInteger otherErrors = new AtomicInteger(0);

        PlaceOrderRequest request = new PlaceOrderRequest();
        request.setShippingAddress("Mumbai Hub, Block 4");

        for (int i = 0; i < CONCURRENT_BUYERS; i++) {
            final String userEmail = buyers.get(i).getEmail();
            final String idempotencyKey = UUID.randomUUID().toString();

            executor.submit(() -> {
                try {
                    // All threads wait at starting gate to fire simultaneously
                    startGun.await();

                    orderService.placeOrder(userEmail, idempotencyKey, request);
                    successfulOrders.incrementAndGet();
                } catch (InsufficientStockException | OptimisticLockException | ObjectOptimisticLockingFailureException ex) {
                    // Handled concurrency or out-of-stock conflict
                    rejectedConflicts.incrementAndGet();
                } catch (Exception ex) {
                    otherErrors.incrementAndGet();
                } finally {
                    finishLatch.countDown();
                }
            });
        }

        // Fire all threads simultaneously
        startGun.countDown();

        // Await all 200 orders to terminate
        boolean completed = finishLatch.await(30, TimeUnit.SECONDS);
        executor.shutdown();

        assertThat(completed).isTrue();
        assertThat(otherErrors.get()).isEqualTo(0);

        // Core assertions:
        // 1. Exactly 10 orders were booked
        assertThat(successfulOrders.get())
                .as("Exactly 10 buyers must succeed out of 200")
                .isEqualTo(INITIAL_STOCK);

        // 2. Exactly 190 buyers were safely rejected with a conflict exception
        assertThat(rejectedConflicts.get())
                .as("Exactly 190 buyers must receive conflict / insufficient stock")
                .isEqualTo(CONCURRENT_BUYERS - INITIAL_STOCK);

        // 3. Final stock must be exactly 0 - NO NEGATIVE OVERSELL
        Product finalProduct = productRepository.findById(flashSaleProduct.getId()).orElseThrow();
        assertThat(finalProduct.getStockQuantity())
                .as("Remaining stock must be strictly 0")
                .isEqualTo(0);

        // 4. Verify orders in database
        long persistedOrders = orderRepository.count();
        assertThat(persistedOrders).isEqualTo(INITIAL_STOCK);
    }
}
