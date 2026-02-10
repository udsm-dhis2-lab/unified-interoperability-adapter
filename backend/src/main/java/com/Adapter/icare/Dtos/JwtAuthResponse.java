package com.Adapter.icare.Dtos;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class JwtAuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private Instant accessTokenExpiry;
    private Instant refreshTokenExpiry;
}
