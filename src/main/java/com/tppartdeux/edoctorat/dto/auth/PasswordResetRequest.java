package com.tppartdeux.edoctorat.dto.auth;

import lombok.Data;

/**
 * Request DTO for password reset
 */
@Data
public class PasswordResetRequest {
    private String email;
    private String redirectUrl;
}
