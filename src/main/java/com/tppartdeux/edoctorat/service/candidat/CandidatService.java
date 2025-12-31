package com.tppartdeux.edoctorat.service.candidat;

import com.tppartdeux.edoctorat.model.auth.User;
import com.tppartdeux.edoctorat.model.candidat.Candidat;
import com.tppartdeux.edoctorat.repository.candidat.CandidatRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CandidatService {

    @Autowired
    private final CandidatRepository candidatRepository;

    //CRUD Functions
    // Create
    public Candidat create(Candidat candidat) {
        return candidatRepository.save(candidat);
    }

    // Read
    public List<Candidat> findAll() {
        return candidatRepository.findAll();
    }

    public Optional<Candidat> findById(Long id) {
        return candidatRepository.findById(id);
    }

    public Optional<Candidat> findByCin(String cin) {
        return candidatRepository.findByCin(cin);
    }

    public Optional<Candidat> findByCne(String cne) {
        return candidatRepository.findByCne(cne);
    }

    public Optional<Candidat> findByUser(User user) {
        return candidatRepository.findByUser(user);
    }

    public List<Candidat> findByEtatDossier(Integer etatDossier) {
        return candidatRepository.findByEtatDossier(etatDossier);
    }

    public boolean existsByCin(String cin) {
        return candidatRepository.existsByCin(cin);
    }

    public boolean existsByCne(String cne) {
        return candidatRepository.existsByCne(cne);
    }

    // Update
    public Candidat update(Long id, Candidat candidatDetails) {
        Candidat candidat = candidatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidat not found with id: " + id));
        
        candidat.setCne(candidatDetails.getCne());
        candidat.setCin(candidatDetails.getCin());
        candidat.setNomCandidatAr(candidatDetails.getNomCandidatAr());
        candidat.setPrenomCandidatAr(candidatDetails.getPrenomCandidatAr());
        candidat.setAdresse(candidatDetails.getAdresse());
        candidat.setAdresseAr(candidatDetails.getAdresseAr());
        candidat.setSexe(candidatDetails.getSexe());
        candidat.setVilleDeNaissance(candidatDetails.getVilleDeNaissance());
        candidat.setVilleDeNaissanceAr(candidatDetails.getVilleDeNaissanceAr());
        candidat.setVille(candidatDetails.getVille());
        candidat.setDateDeNaissance(candidatDetails.getDateDeNaissance());
        candidat.setTypeDeHandiCape(candidatDetails.getTypeDeHandiCape());
        candidat.setAcademie(candidatDetails.getAcademie());
        candidat.setTelCandidat(candidatDetails.getTelCandidat());
        candidat.setPathCv(candidatDetails.getPathCv());
        candidat.setPathPhoto(candidatDetails.getPathPhoto());
        candidat.setEtatDossier(candidatDetails.getEtatDossier());
        candidat.setSituationFamiliale(candidatDetails.getSituationFamiliale());
        candidat.setPays(candidatDetails.getPays());
        candidat.setUser(candidatDetails.getUser());
        candidat.setFonctionaire(candidatDetails.getFonctionaire());
        
        return candidatRepository.save(candidat);
    }

    // Delete
    public void delete(Long id) {
        if (!candidatRepository.existsById(id)) {
            throw new RuntimeException("Candidat not found with id: " + id);
        }
        candidatRepository.deleteById(id);
    }

    public void deleteAll() {
        candidatRepository.deleteAll();
    }

    public long count() {
        return candidatRepository.count();
    }
}
