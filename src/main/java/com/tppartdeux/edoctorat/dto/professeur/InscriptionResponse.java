package com.tppartdeux.edoctorat.dto.professeur;

import com.tppartdeux.edoctorat.dto.candidat.CandidatResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Inscription response DTO matching Angular's Inscription interface
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InscriptionResponse {
    private Long id;
    private CandidatResponse candidat;
    private SujetResponse sujet;
    private String dateDiposeDossier;
    private String remarque;
    private Boolean valider;
    private String pathFile;
}
