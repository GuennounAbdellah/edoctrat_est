package com.tppartdeux.edoctorat.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for pre-registration matching Angular's PreRegistration interface
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PreRegistrationResponse {
    private String nom;
    private String prenom;
    private String email;
}
