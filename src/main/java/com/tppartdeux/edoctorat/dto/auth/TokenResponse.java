package com.tppartdeux.edoctorat.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Token response DTO matching Angular's Token interface
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenResponse {
    private String access;
    private String refresh;
}
