package com.tppartdeux.edoctorat.dto.professeur;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Sujet response DTO matching Angular's Sujet interface
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SujetResponse {
    private Long id;
    private ProfesseurResponse professeur;
    private ProfesseurResponse coDirecteur;
    private String titre;
    private String description;
    private FormationDoctoraleResponse formationDoctorale;
    private Boolean publier;
}
