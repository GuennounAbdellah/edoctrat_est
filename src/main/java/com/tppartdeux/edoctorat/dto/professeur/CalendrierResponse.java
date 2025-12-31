package com.tppartdeux.edoctorat.dto.professeur;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Calendrier response DTO matching Angular's Calendrier interface
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalendrierResponse {
    private Integer id;
    private String action;
    private String dateDebut;
    private String dateFin;
    private String pour;
}
