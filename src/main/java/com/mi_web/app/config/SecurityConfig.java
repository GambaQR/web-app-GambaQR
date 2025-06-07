package com.mi_web.app.config;

import com.mi_web.app.repositories.UserRepository;
import com.mi_web.app.security.JwtAuthenticationFilter;
import com.mi_web.app.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByUsername(username)
                .map(user -> org.springframework.security.core.userdetails.User
                        .withUsername(user.getUsername())
                        .password(user.getPassword())
                        .authorities(user.getRole().name())
                        .build()
                ).orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtUtil, userDetailsService());
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Endpoints públicos
                        .requestMatchers(
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
                                "/api/payments/public-key",
                                "/api/payments/user/{userId}",
                                "/api/payments/order/{orderId}",
                                "/api/payments/delete/{id}",
                                "/api/payments/update/{id}",
                                "/api/payments/create-payment-intent",
                                "/api/payments/confirm-payment",
                                "/api/qrcodes/create"

                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .anonymous(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);


        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}