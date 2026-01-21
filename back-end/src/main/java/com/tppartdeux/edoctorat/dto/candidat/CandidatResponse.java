package com.tppartdeux.edoctorat.dto.candidat;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Candidat response DTO matching Angular's Candidat interface
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidatResponse {
    private Long id;
    private String cne;
    private String pays;
    private String nom;
    private String prenom;
    private String email;
    private String cin;
    private String nomCandidatAr;
    private String prenomCandidatAr;
    private String adresse;
    private String adresseAr;
    private String sexe;
    private String villeDeNaissance;
    private String villeDeNaissanceAr;
    private String ville;
    private String dateDeNaissance;
    private String typeDeHandiCape;
    private String academie;
    private String telCandidat;
    private String pathCv;
    private String pathPhoto;
    private Integer etatDossier;
    private String commentaireScolarite;
    
    @JsonProperty("situation_familiale")
    private String situationFamiliale;
    
    private String fonctionnaire;
}
