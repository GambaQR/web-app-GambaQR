package com.mi_web.app.services;

import com.mi_web.app.dtos.auth.*;
import com.mi_web.app.enums.Role;
import com.mi_web.app.models.User;
import com.mi_web.app.models.UserInfo;
import com.mi_web.app.repositories.UserInfoRepository;
import com.mi_web.app.repositories.UserRepository;
import com.mi_web.app.security.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserInfoRepository userInfoRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .map(user -> org.springframework.security.core.userdetails.User
                        .withUsername(user.getUsername())
                        .password(user.getPassword())
                        .authorities(user.getRole().name())
                        .build()
                ).orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Transactional
    public void deleteUserById(Long id) {
        userInfoRepository.deleteByUserId(id);
        userRepository.deleteById(id);
    }

    @Transactional
    public User createUser(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        try {
            Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + request.getRole());
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.valueOf(request.getRole()));
        user = userRepository.save(user);

        UserInfo userInfo = new UserInfo();
        userInfo.setUser(user);
        userInfo.setFirstName(request.getFirstName());
        userInfo.setLastName(request.getLastName());
        userInfo.setAddress(request.getAddress());
        userInfo.setPhone(request.getPhone());
        userInfo.setEmail(request.getEmail());
        userInfoRepository.save(userInfo);

        return user;
    }

    @Transactional
    public LoginResponse login(LoginRequest credentials) {
        User user = userRepository.findByUsername(credentials.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(credentials.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        return LoginResponse.builder()
                .username(user.getUsername())
                .role(user.getRole().name())
                .token(jwtUtil.generateToken(user.getUsername()))
                .userId(Long.valueOf(user.getId()))
                .build();
    }

    public boolean checkToken(CheckTokenRequest request) {
        return jwtUtil.validateToken(request.getToken(), request.getUsername());
    }

    public Optional<UserDetailResponse> getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        UserInfo userInfo = userInfoRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("User info not found"));

        return Optional.of(new UserDetailResponse(
                userInfo.getFirstName(),
                userInfo.getLastName(),
                userInfo.getAddress(),
                userInfo.getPhone(),
                userInfo.getEmail()
        ));
    }

    @Transactional
    public boolean updatePassword(String username, String oldPassword, String newPassword) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent() && passwordEncoder.matches(oldPassword, userOpt.get().getPassword())) {
            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return true;
        }
        return false;
    }
}
