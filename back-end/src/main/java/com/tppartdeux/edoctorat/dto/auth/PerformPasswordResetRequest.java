package com.tppartdeux.edoctorat.dto.auth;

import lombok.Data;

/**
 * Request DTO for performing password reset with token
 */
@Data
public class PerformPasswordResetRequest {
    private String password;
    private String token;
}
