package com.tppartdeux.edoctorat.service.professeur;

import com.tppartdeux.edoctorat.model.candidat.Candidat;
import com.tppartdeux.edoctorat.model.professeur.Inscription;
import com.tppartdeux.edoctorat.model.professeur.Sujet;
import com.tppartdeux.edoctorat.repository.professeur.InscriptionRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class InscriptionService {

    @Autowired
    private final InscriptionRepository inscriptionRepository;

    //CRUD Functions
    // Create
    public Inscription create(Inscription inscription) {
        return inscriptionRepository.save(inscription);
    }

    // Read
    public List<Inscription> findAll() {
        return inscriptionRepository.findAll();
    }

    public Optional<Inscription> findById(Long id) {
        return inscriptionRepository.findById(id);
    }

    public List<Inscription> findByCandidat(Candidat candidat) {
        return inscriptionRepository.findByCandidat(candidat);
    }

    public List<Inscription> findBySujet(Sujet sujet) {
        return inscriptionRepository.findBySujet(sujet);
    }

    public List<Inscription> findByValider(Boolean valider) {
        return inscriptionRepository.findByValider(valider);
    }

    public Optional<Inscription> findByCandidatAndSujet(Candidat candidat, Sujet sujet) {
        return inscriptionRepository.findByCandidatAndSujet(candidat, sujet);
    }

    // Update
    public Inscription update(Long id, Inscription inscriptionDetails) {
        Inscription inscription = inscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inscription not found with id: " + id));
        
        inscription.setDateDiposeDossier(inscriptionDetails.getDateDiposeDossier());
        inscription.setRemarque(inscriptionDetails.getRemarque());
        inscription.setValider(inscriptionDetails.getValider());
        inscription.setCandidat(inscriptionDetails.getCandidat());
        inscription.setSujet(inscriptionDetails.getSujet());
        
        return inscriptionRepository.save(inscription);
    }

    // Delete
    public void delete(Long id) {
        if (!inscriptionRepository.existsById(id)) {
            throw new RuntimeException("Inscription not found with id: " + id);
        }
        inscriptionRepository.deleteById(id);
    }

    public void deleteAll() {
        inscriptionRepository.deleteAll();
    }

    public long count() {
        return inscriptionRepository.count();
    }
}
