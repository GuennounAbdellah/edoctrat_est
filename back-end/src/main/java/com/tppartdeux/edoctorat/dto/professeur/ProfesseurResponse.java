package com.tppartdeux.edoctorat.dto.professeur;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Professeur response DTO matching Angular's Professeur interface
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfesseurResponse {
    private Long id;
    private String nom;
    private String prenom;
}
