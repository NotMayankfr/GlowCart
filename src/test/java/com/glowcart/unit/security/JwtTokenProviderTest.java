package com.glowcart.unit.security;

import com.glowcart.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;
    private final String testSecret = "dGhpcy1pcy1hLXZlcnktc2VjdXJlLWFuZC1sb25nLWp3dC1zZWNyZXQta2V5LXRoYXQtaXMtYXQtbGVhc3QtNjQtYnl0ZXMtbG9uZy1mb3ItaHM1MTI=";

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(tokenProvider, "jwtSecret", testSecret);
        ReflectionTestUtils.setField(tokenProvider, "jwtExpirationMs", 3600000); // 1 hour
    }

    @Test
    @DisplayName("Generate token creates valid JWT and extracts subject")
    void generateAndValidateToken() {
        User userDetails = new User("mayank@example.com", "password", List.of(new SimpleGrantedAuthority("ROLE_CUSTOMER")));
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        String token = tokenProvider.generateToken(auth);

        assertThat(token).isNotBlank();
        assertThat(tokenProvider.validateToken(token)).isTrue();
        assertThat(tokenProvider.getUserEmailFromJWT(token)).isEqualTo("mayank@example.com");
    }

    @Test
    @DisplayName("Validate token returns false on invalid or tampered token")
    void validateToken_invalidToken() {
        assertThat(tokenProvider.validateToken("invalid.jwt.token")).isFalse();
    }
}
