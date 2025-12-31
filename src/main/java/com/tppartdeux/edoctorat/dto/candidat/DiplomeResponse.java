package com.tppartdeux.edoctorat.dto.candidat;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Diplome response DTO matching Angular's Diplome interface
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiplomeResponse {
    private Long id;
    private String intitule;
    private String type;
    private String dateCommission;
    private String mention;
    private String pays;
    private String etablissement;
    private String specialite;
    private String ville;
    private String province;
    
    @JsonProperty("moyen_generale")
    private Double moyenGenerale;
    
    private List<AnnexeResponse> annexes;
}
