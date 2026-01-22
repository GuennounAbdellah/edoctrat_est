package com.tppartdeux.edoctorat.service.candidat;

import com.tppartdeux.edoctorat.dto.professeur.CandidatPostulerDTO;
import com.tppartdeux.edoctorat.dto.professeur.PostulerJoinedResponse;  // Add this import
import com.tppartdeux.edoctorat.model.candidat.Candidat;
import com.tppartdeux.edoctorat.model.candidat.Postuler;
import com.tppartdeux.edoctorat.model.professeur.Sujet;
import com.tppartdeux.edoctorat.repository.candidat.PostulerRepository;
import lombok.RequiredArgsConstructor;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PostulerService {

    private final PostulerRepository postulerRepository;

    //CRUD Functions
    // Create
    public Postuler create(Postuler postuler) {
        return postulerRepository.save(postuler);
    }

    // Read
    public List<Postuler> findAll() {
        return postulerRepository.findAll();
    }

    public Optional<Postuler> findById(Long id) {
        return postulerRepository.findById(id);
    }

    public List<PostulerJoinedResponse> getCandidatsJoinedData() {
        List<PostulerJoinedResponse> result = postulerRepository.findAll().stream().map(postuler -> {
            // Get candidat info
            String cne = postuler.getCandidat().getCne();
            String nom = (postuler.getCandidat().getUser() != null) ? postuler.getCandidat().getUser().getLastName() : null;
            String prenom = (postuler.getCandidat().getUser() != null) ? postuler.getCandidat().getUser().getFirstName() : null;
            
            // Get sujet info
            String sujetTitre = postuler.getSujet().getTitre();
            
            // Get directeur info
            String directeurNom = null;
            String directeurPrenom = null;
            if (postuler.getSujet().getProfesseur() != null && postuler.getSujet().getProfesseur().getUser() != null) {
                directeurNom = postuler.getSujet().getProfesseur().getUser().getLastName();
                directeurPrenom = postuler.getSujet().getProfesseur().getUser().getFirstName();
            }
            
            // Get co-directeur info
            String codirecteurNom = null;
            String codirecteurPrenom = null;
            if (postuler.getSujet().getCoDirecteur() != null && postuler.getSujet().getCoDirecteur().getUser() != null) {
                codirecteurNom = postuler.getSujet().getCoDirecteur().getUser().getLastName();
                codirecteurPrenom = postuler.getSujet().getCoDirecteur().getUser().getFirstName();
            }
            
            // Get formation doctorale info
            String formationDoctorale = postuler.getSujet().getFormationDoctorale() != null
                ? postuler.getSujet().getFormationDoctorale().getTitre()
                : null;

            return PostulerJoinedResponse.builder()
                .id(postuler.getId())
                .cne(cne)
                .nom(nom)
                .prenom(prenom)
                .sujetPostule(sujetTitre)
                .directeurNom(directeurNom)
                .directeurPrenom(directeurPrenom)
                .codirecteurNom(codirecteurNom)
                .codirecteurPrenom(codirecteurPrenom)
                .formationDoctorale(formationDoctorale)
                .build();
        }).collect(Collectors.toList());
        
        System.out.println("getCandidatsJoinedData returned: " + result);
        return result;
    }
    
    public List<Postuler> findByCandidat(Candidat candidat) {
        return postulerRepository.findByCandidat(candidat);
    }

    public List<Postuler> findBySujet(Sujet sujet) {
        return postulerRepository.findBySujet(sujet);
    }

    public Optional<Postuler> findByCandidatAndSujet(Candidat candidat, Sujet sujet) {
        return postulerRepository.findByCandidatAndSujet(candidat, sujet);
    }

    public Optional<Postuler> findByCandidatCne(String cne) {
        return postulerRepository.findByCandidat_Cne(cne);
    }

    // Update
    public Postuler update(Long id, Postuler postulerDetails) {
        Postuler postuler = postulerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Postuler not found with id: " + id));
        
        postuler.setPathFile(postulerDetails.getPathFile());
        postuler.setCandidat(postulerDetails.getCandidat());
        postuler.setSujet(postulerDetails.getSujet());
        
        return postulerRepository.save(postuler);
    }

    // Delete
    public void delete(Long id) {
        if (!postulerRepository.existsById(id)) {
            throw new RuntimeException("Postuler not found with id: " + id);
        }
        postulerRepository.deleteById(id);
    }

    public void deleteAll() {
        postulerRepository.deleteAll();
    }

    public long count() {
        return postulerRepository.count();
    }
}