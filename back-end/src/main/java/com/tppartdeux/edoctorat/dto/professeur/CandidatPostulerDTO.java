package com.tppartdeux.edoctorat.dto.professeur;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CandidatPostulerDTO {
    private String cne;
    private String nom;
    private String prenom;
    private String sujetTitre;
    private String directeur;
    private String coDirecteur;
    private String formationDoctorale;
}
