package com.mi_web.app.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;


@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    // Lista de rutas públicas que no requieren autenticación
    private static final String[] PUBLIC_ENDPOINTS = {
            "/api/users/login",
            "/api/users/register",
            "/api/users/check-token",
            "/api/users/profile",
            "/api/users/all",
            "/api/users/employees/{restaurantId}",
            "/api/users",
            "/api/users/delete/**",
            "/api/restaurants/all",
            "/api/restaurants/create",
            "/api/restaurants/update",
            "/api/restaurants/delete/**",
            "/api/restaurants/**",
            "/api/products/create",
            "/api/products/all",
            "/api/products/update/{id}",
            "/api/products/delete/{id}",
            "/api/products/{id}",
            "/api/products/by-restaurant/**",
            "/api/categories/{id}",
            "/api/categories/all",
            "/api/categories/create",
            "/api/categories/update/{id}",
            "/api/categories/delete/**",
            "/api/combos/create",
            "/api/combos/all",
            "/api/combos/{id}",
            "/api/combos/update/{id}",
            "/api/combos/delete/{id}",
            "/api/combos/by-restaurant/{restaurantId}",
            "/api/orders/create",
            "/api/orders/all",
            "/api/orders/by-user/{userId}",
            "/api/orders/{id}",
            "/api/orders/update/{id}",
            "/api/orders/delete/{id}",
            "/api/payments/process",
            "/api/payments/user/{userId}",
            "/api/payments/order/{orderId}",
            "/api/payments/delete/{id}",
            "/api/payments/update/{id}",
            "/api/qrcodes/create"
    };

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();

        // Ignorar métodos OPTIONS (usados en preflight CORS) y rutas públicas
        return "OPTIONS".equalsIgnoreCase(request.getMethod()) ||
                Arrays.stream(PUBLIC_ENDPOINTS).anyMatch(path::startsWith);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();
        log.debug("Solicitud recibida: {}", path);

        final String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            log.debug("Token recibido: {}", authHeader.substring(7));
            token = authHeader.substring(7);

            try {
                username = jwtUtil.extractUsername(token);
            } catch (JwtException e) {
                log.error("Error al extraer el username del token: {}", e.getMessage());
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (jwtUtil.validateToken(token, username)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}