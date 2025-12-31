package com.tppartdeux.edoctorat.dto.professeur;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Commission response DTO matching Angular's Commission interface
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommissionResponse {
    private Long id;
    private String dateCommission;
    private String heure;
    private Boolean valider;
    private String lieu;
    private Long labo;
    private List<ProfesseurResponse> participants;
    private List<SujetResponse> sujets;
}
