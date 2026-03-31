package com.tammalls.api.service;

import com.tammalls.api.dto.AuthResponseDto;
import com.tammalls.api.dto.UserLoginDto;
import com.tammalls.api.dto.UserRegistrationDto;
import com.tammalls.api.entity.User;
import com.tammalls.api.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    public AuthResponseDto registerCustomer(UserRegistrationDto dto) {
        User user = userService.registerUser(dto, User.UserRole.CUSTOMER);
        String token = jwtTokenProvider.generateTokenFromUsername(user.getUsername());
        
        return AuthResponseDto.builder()
                .token(token)
                .user(userService.convertToDto(user))
                .tokenType("Bearer")
                .build();
    }

    public AuthResponseDto registerSeller(UserRegistrationDto dto) {
        User user = userService.registerUser(dto, User.UserRole.SELLER);
        String token = jwtTokenProvider.generateTokenFromUsername(user.getUsername());
        
        return AuthResponseDto.builder()
                .token(token)
                .user(userService.convertToDto(user))
                .tokenType("Bearer")
                .build();
    }

    public AuthResponseDto login(UserLoginDto dto) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            dto.getUsername(),
                            dto.getPassword()
                    )
            );

            String token = jwtTokenProvider.generateToken(authentication);
            
            User user = userService.findByUsername(dto.getUsername())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            return AuthResponseDto.builder()
                    .token(token)
                    .user(userService.convertToDto(user))
                    .tokenType("Bearer")
                    .build();
        } catch (Exception e) {
            log.error("Login failed: {}", e.getMessage());
            throw new IllegalArgumentException("Invalid username or password");
        }
    }
}
