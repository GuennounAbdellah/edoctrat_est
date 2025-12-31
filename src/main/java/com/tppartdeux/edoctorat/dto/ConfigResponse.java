package com.tppartdeux.edoctorat.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Config response DTO matching Angular's Config interface
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConfigResponse {
    @JsonProperty("max_sujet_postuler")
    private Integer maxSujetPostuler;
    
    @JsonProperty("date_debut_postuler_sujet_candidat")
    private LocalDate dateDebutPostulerSujetCandidat;
    
    @JsonProperty("date_debut_modifier_sujet_prof")
    private LocalDate dateDebutModifierSujetProf;
    
    @JsonProperty("date_fin_postuler_sujet_candidat")
    private LocalDate dateFinPostulerSujetCandidat;
    
    @JsonProperty("date_fin_modifier_sujet_prof")
    private LocalDate dateFinModifierSujetProf;
}
