package com.tppartdeux.edoctorat.dto.professeur;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Directeur Labo response DTO with laboratory information
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DirecteurLaboResponse {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String departement;
    private Long laboratoireId;
    private String laboratoireNom;
    private String laboratoireDescription;
}
