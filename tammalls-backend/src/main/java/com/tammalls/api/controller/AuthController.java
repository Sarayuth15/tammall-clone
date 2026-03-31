package com.tammalls.api.controller;

import com.tammalls.api.dto.AuthResponseDto;
import com.tammalls.api.dto.UserLoginDto;
import com.tammalls.api.dto.UserRegistrationDto;
import com.tammalls.api.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Registration and login endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/customer")
    @Operation(
            summary = "Register a customer",
            description = "Creates a new CUSTOMER account and returns an auth response (typically includes JWT token)."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Customer registered",
                    content = @Content(schema = @Schema(implementation = AuthResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input / registration failed",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    public ResponseEntity<?> registerCustomer(@RequestBody UserRegistrationDto dto) {
        try {
            AuthResponseDto response = authService.registerCustomer(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/register/seller")
    @Operation(
            summary = "Register a seller",
            description = "Creates a new SELLER account and returns an auth response (typically includes JWT token)."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Seller registered",
                    content = @Content(schema = @Schema(implementation = AuthResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input / registration failed",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    public ResponseEntity<?> registerSeller(@RequestBody UserRegistrationDto dto) {
        try {
            AuthResponseDto response = authService.registerSeller(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    @Operation(
            summary = "Login",
            description = "Authenticates user credentials and returns an auth response (typically includes JWT token)."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Logged in",
                    content = @Content(schema = @Schema(implementation = AuthResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid credentials / login failed",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    public ResponseEntity<?> login(@RequestBody UserLoginDto dto) {
        try {
            AuthResponseDto response = authService.login(dto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
