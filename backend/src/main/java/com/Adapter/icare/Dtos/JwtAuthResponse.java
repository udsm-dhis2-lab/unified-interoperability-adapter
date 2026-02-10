package com.Adapter.icare.Dtos;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class JwtAuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType; // "Bearer"
    private Instant accessTokenExpiry; // helpful for frontend to know when to refresh
}
