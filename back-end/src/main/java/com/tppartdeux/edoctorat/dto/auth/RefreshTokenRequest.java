package com.tppartdeux.edoctorat.dto.auth;

import lombok.Data;

/**
 * Request DTO for refresh token
 */
@Data
public class RefreshTokenRequest {
    private String refresh;
}
