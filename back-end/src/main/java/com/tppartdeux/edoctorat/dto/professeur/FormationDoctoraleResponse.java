package com.tppartdeux.edoctorat.dto.professeur;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * FormationDoctorale response DTO matching Angular's FormationDoctorale interface
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormationDoctoraleResponse {
    private Long id;
    private Long ced;
    private String etablissement;
    private String axeDeRecherche;
    private String pathImage;
    private String titre;
    private String initiale;
    private String dateAccreditation;
}
