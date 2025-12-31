package com.tppartdeux.edoctorat.dto.auth;

import lombok.Data;

/**
 * Request DTO for email confirmation during pre-registration
 */
@Data
public class ConfirmEmailRequest {
    private String email;
    private String nom;
    private String prenom;
    private String origin;
}
