package com.tppartdeux.edoctorat.dto.candidat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Annexe response DTO matching Angular's Annexe interface
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnnexeResponse {
    private String typeAnnexe;
    private String titre;
    private String pathFile;
}
