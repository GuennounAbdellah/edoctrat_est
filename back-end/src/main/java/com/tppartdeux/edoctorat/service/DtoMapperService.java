package com.tppartdeux.edoctorat.service;

import com.tppartdeux.edoctorat.dto.candidat.AnnexeResponse;
import com.tppartdeux.edoctorat.dto.candidat.CandidatResponse;
import com.tppartdeux.edoctorat.dto.candidat.DiplomeResponse;
import com.tppartdeux.edoctorat.dto.professeur.*;
import com.tppartdeux.edoctorat.model.candidat.*;
import com.tppartdeux.edoctorat.model.professeur.*;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service to map entities to DTOs matching Angular interfaces
 */
@Service
public class DtoMapperService {

    public CandidatResponse toCandidatResponse(Candidat candidat) {
        if (candidat == null) return null;
        return CandidatResponse.builder()
                .id(candidat.getId())
                .cne(candidat.getCne())
                .cin(candidat.getCin())
                .pays(candidat.getPays() != null ? candidat.getPays().getNom() : null)
                .nom(candidat.getUser() != null ? candidat.getUser().getLastName() : null)
                .prenom(candidat.getUser() != null ? candidat.getUser().getFirstName() : null)
                .email(candidat.getUser() != null ? candidat.getUser().getEmail() : null)
                .nomCandidatAr(candidat.getNomCandidatAr())
                .prenomCandidatAr(candidat.getPrenomCandidatAr())
                .adresse(candidat.getAdresse())
                .adresseAr(candidat.getAdresseAr())
                .sexe(candidat.getSexe())
                .villeDeNaissance(candidat.getVilleDeNaissance())
                .villeDeNaissanceAr(candidat.getVilleDeNaissanceAr())
                .ville(candidat.getVille())
                .dateDeNaissance(candidat.getDateDeNaissance() != null ? candidat.getDateDeNaissance().toString() : null)
                .typeDeHandiCape(candidat.getTypeDeHandiCape())
                .academie(candidat.getAcademie())
                .telCandidat(candidat.getTelCandidat())
                .pathCv(candidat.getPathCv())
                .pathPhoto(candidat.getPathPhoto())
                .etatDossier(candidat.getEtatDossier())
                .situationFamiliale(candidat.getSituationFamiliale())
                .fonctionnaire(candidat.getFonctionaire() != null ? candidat.getFonctionaire().toString() : null)
                .build();
    }

    public ProfesseurResponse toProfesseurResponse(Professeur professeur) {
        if (professeur == null) return null;
        return ProfesseurResponse.builder()
                .id(professeur.getId())
                .nom(professeur.getUser() != null ? professeur.getUser().getLastName() : null)
                .prenom(professeur.getUser() != null ? professeur.getUser().getFirstName() : null)
                .build();
    }

    public FormationDoctoraleResponse toFormationDoctoraleResponse(FormationDoctorale fd) {
        if (fd == null) return null;
        return FormationDoctoraleResponse.builder()
                .id(fd.getId())
                .ced(fd.getCed() != null ? fd.getCed().getId() : null)
                .etablissement(fd.getEtablissementId() != null ? fd.getEtablissementId(): null)
                .axeDeRecherche(fd.getAxeDeRecherche())
                .pathImage(fd.getPathImage())
                .titre(fd.getTitre())
                .initiale(fd.getInitiale())
                .dateAccreditation(fd.getDateAccreditation() != null ? fd.getDateAccreditation().toString() : null)
                .build();
    }

    public SujetResponse toSujetResponse(Sujet sujet) {
        if (sujet == null) return null;
        return SujetResponse.builder()
                .id(sujet.getId())
                .titre(sujet.getTitre())
                .description(sujet.getDescription())
                .publier(sujet.getPublier())
                .professeur(toProfesseurResponse(sujet.getProfesseur()))
                .coDirecteur(toProfesseurResponse(sujet.getCoDirecteur()))
                .formationDoctorale(toFormationDoctoraleResponse(sujet.getFormationDoctorale()))
                .build();
    }

    public PostulerResponse toPostulerResponse(Postuler postuler) {
        if (postuler == null) return null;
        return PostulerResponse.builder()
                .id(postuler.getId())
                .pathFile(postuler.getPathFile())
                .sujet(toSujetResponse(postuler.getSujet()))
                .candidat(toCandidatResponse(postuler.getCandidat()))
                .build();
    }

    public DiplomeResponse toDiplomeResponse(Diplome diplome, List<Annexe> annexes) {
        if (diplome == null) return null;
        List<AnnexeResponse> annexeResponses = annexes != null ? 
            annexes.stream().map(this::toAnnexeResponse).collect(Collectors.toList()) : 
            Collections.emptyList();
        
        return DiplomeResponse.builder()
                .id(diplome.getId())
                .intitule(diplome.getIntitule())
                .type(diplome.getType())
                .dateCommission(diplome.getDateCommission() != null ? diplome.getDateCommission().toString() : null)
                .mention(diplome.getMention())
                .pays(diplome.getPays())
                .etablissement(diplome.getEtablissement())
                .specialite(diplome.getSpecialite())
                .ville(diplome.getVille())
                .province(diplome.getProvince())
                .moyenGenerale(diplome.getMoyenGenerale())
                .annexes(annexeResponses)
                .build();
    }

    public AnnexeResponse toAnnexeResponse(Annexe annexe) {
        if (annexe == null) return null;
        return AnnexeResponse.builder()
                .typeAnnexe(annexe.getTypeAnnexe())
                .titre(annexe.getTitre())
                .pathFile(annexe.getPathFile())
                .build();
    }

    public CommissionResponse toCommissionResponse(Commission commission, List<Professeur> participants, List<Sujet> sujets) {
        if (commission == null) return null;
        return CommissionResponse.builder()
                .id(commission.getId())
                .dateCommission(commission.getDateCommission() != null ? commission.getDateCommission().toString() : null)
                .heure(commission.getHeure() != null ? commission.getHeure().toString() : null)
                .valider(false) // Default, adjust based on actual logic
                .lieu(commission.getLieu())
                .labo(commission.getLabo() != null ? commission.getLabo().getId() : null)
                .participants(participants != null ? participants.stream().map(this::toProfesseurResponse).collect(Collectors.toList()) : Collections.emptyList())
                .sujets(sujets != null ? sujets.stream().map(this::toSujetResponse).collect(Collectors.toList()) : Collections.emptyList())
                .build();
    }

    public ExaminerResponse toExaminerResponse(Examiner examiner) {
        if (examiner == null) return null;
        return ExaminerResponse.builder()
                .id(examiner.getId())
                .sujet(toSujetResponse(examiner.getSujet()))
                .cne(examiner.getCandidat() != null ? examiner.getCandidat().getCne() : null)
                .noteDossier(examiner.getNoteDossier())
                .noteEntretien(examiner.getNoteEntretien())
                .decision(examiner.getDecision())
                .commission(examiner.getCommission() != null ? examiner.getCommission().getId() : null)
                .candidat(toCandidatResponse(examiner.getCandidat()))
                .publier(examiner.getPublier())
                .build();
    }

    public InscriptionResponse toInscriptionResponse(Inscription inscription) {
        if (inscription == null) return null;
        return InscriptionResponse.builder()
                .id(inscription.getId())
                .candidat(toCandidatResponse(inscription.getCandidat()))
                .sujet(toSujetResponse(inscription.getSujet()))
                .dateDiposeDossier(inscription.getDateDiposeDossier() != null ? inscription.getDateDiposeDossier().toString() : null)
                .remarque(inscription.getRemarque())
                .valider(inscription.getValider())
                .pathFile(null) // Not in entity, add if needed
                .build();
    }

    public CalendrierResponse toCalendrierResponse(DirecteurPoleCalendrier calendrier) {
        if (calendrier == null) return null;
        return CalendrierResponse.builder()
                .id(calendrier.getId())
                .action(calendrier.getAction())
                .dateDebut(calendrier.getDateDebut() != null ? calendrier.getDateDebut().toString() : null)
                .dateFin(calendrier.getDateFin() != null ? calendrier.getDateFin().toString() : null)
                .pour(calendrier.getPour())
                .build();
    }
    
    public PostulerResponse toPostulerResponse(CandidatPostulerDTO candidatPostulerDTO) {
        if (candidatPostulerDTO == null) return null;
        return PostulerResponse.builder()
                .id(null) // CandidatPostulerDTO doesn't have ID, so set to null
                .pathFile(null) // CandidatPostulerDTO doesn't have pathFile
                .sujet(SujetResponse.builder().titre(candidatPostulerDTO.getSujetTitre()).build())
                .candidat(CandidatResponse.builder()
                    .cne(candidatPostulerDTO.getCne())
                    .nom(candidatPostulerDTO.getNom())
                    .prenom(candidatPostulerDTO.getPrenom())
                    .build())
                .build();
    }
}
