package com.Adapter.icare.Services;

import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Configurations.JwtTokenProvider;
import com.Adapter.icare.Domains.RefreshToken;
import com.Adapter.icare.Dtos.JwtAuthResponse;
import com.Adapter.icare.Dtos.LoginDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;

@Service
public class AuthService {

    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private RefreshTokenService refreshTokenService;
    @Autowired private UserService userService;

    public JwtAuthResponse login(LoginDTO loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = jwtTokenProvider.generateAccessToken(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

       RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());

        return JwtAuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .accessTokenExpiry(Instant.now().plusMillis(jwtTokenProvider.getExpirationTime()))
                .refreshTokenExpiry(refreshToken.getExpiryDate())
                .build();
    }
}