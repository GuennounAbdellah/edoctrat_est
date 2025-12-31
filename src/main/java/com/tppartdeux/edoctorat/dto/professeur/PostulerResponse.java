package com.tppartdeux.edoctorat.dto.professeur;

import com.tppartdeux.edoctorat.dto.candidat.CandidatResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Postuler response DTO matching Angular's Postuler interface
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostulerResponse {
    private Long id;
    private String pathFile;
    private SujetResponse sujet;
    private CandidatResponse candidat;
}
