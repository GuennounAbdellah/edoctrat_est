package com.tppartdeux.edoctorat.dto.auth;

import lombok.Data;

/**
 * Request DTO for verifying pre-registration token
 */
@Data
public class VerifyTokenRequest {
    private String token;
}
