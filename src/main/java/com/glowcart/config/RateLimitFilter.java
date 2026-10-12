package com.glowcart.config;

import com.glowcart.security.JwtTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {

    private final StringRedisTemplate redisTemplate;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (!request.getRequestURI().startsWith("/api/v1/orders") || !request.getMethod().equalsIgnoreCase("POST")) {
            filterChain.doFilter(request, response);
            return;
        }

        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            if (jwtTokenProvider.validateToken(token)) {
                String email = jwtTokenProvider.getUserEmailFromJWT(token);
                String key = "rate_limit:orders:" + email;

                try {
                    Long count = redisTemplate.opsForValue().increment(key);
                    if (count != null && count == 1) {
                        redisTemplate.expire(key, 60, TimeUnit.SECONDS);
                    }
                    if (count != null && count > 10) {
                        response.setStatus(429);
                        response.setContentType("application/json");
                        response.getWriter().write("""
                            {"status":429,"error":"Too Many Requests","message":"Rate limit exceeded. Maximum 10 order requests per minute."}
                        """);
                        return;
                    }
                } catch (Exception ex) {
                    // Graceful degradation: If Redis is temporarily unreachable, do not block checkout
                    log.warn("Redis rate limiter unavailable, failing open: {}", ex.getMessage());
                }
            }
        }
        filterChain.doFilter(request, response);
    }
}
