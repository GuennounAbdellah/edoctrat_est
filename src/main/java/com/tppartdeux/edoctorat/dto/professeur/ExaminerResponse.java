package com.tppartdeux.edoctorat.dto.professeur;

import com.tppartdeux.edoctorat.dto.candidat.CandidatResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Examiner response DTO matching Angular's Examiner interface
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExaminerResponse {
    private Long id;
    private SujetResponse sujet;
    private String cne;
    private Float noteDossier;
    private Integer noteEntretien;
    private String decision;
    private Long commission;
    private CandidatResponse candidat;
    private Boolean publier;
}
