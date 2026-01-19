package com.tppartdeux.edoctorat.dto.professeur;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for joined data of candidat, sujet, directeurs and formation doctorale
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostulerJoinedResponse {
    private Long id;
    private String cne;
    private String nom;
    private String prenom;
    private String sujetPostule;
    private String directeurNom;
    private String directeurPrenom;
    private String codirecteurNom;
    private String codirecteurPrenom;
    private String formationDoctorale;
}