package com.tppartdeux.edoctorat.service.professeur;

import com.tppartdeux.edoctorat.model.professeur.Sujet;
import com.tppartdeux.edoctorat.model.professeur.Professeur;
import com.tppartdeux.edoctorat.model.professeur.FormationDoctorale;
import com.tppartdeux.edoctorat.repository.professeur.SujetRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class SujetService {

    @Autowired
    private final SujetRepository sujetRepository;

    //CRUD Functions
    // Create
    public Sujet create(Sujet sujet) {
        return sujetRepository.save(sujet);
    }

    // Read
    public List<Sujet> findAll() {
        return sujetRepository.findAll();
    }

    public Optional<Sujet> findById(Long id) {
        return sujetRepository.findById(id);
    }

    public List<Sujet> findByProfesseur(Professeur professeur) {
        return sujetRepository.findByProfesseur(professeur);
    }

    public List<Sujet> findByFormationDoctorale(FormationDoctorale formationDoctorale) {
        return sujetRepository.findByFormationDoctorale(formationDoctorale);
    }

    public Optional<List<Sujet>> findByPublier(Boolean publier) {
        try {
            List<Sujet> sujets = sujetRepository.findByPublier(publier);
            if (sujets.isEmpty()) {
                return Optional.empty();
            } else {
                return Optional.of((sujets));
           }
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public List<Sujet> findByCoDirecteur(Professeur coDirecteur) {
        return sujetRepository.findByCoDirecteur(coDirecteur);
    }

    // Update
    public Sujet update(Long id, Sujet sujetDetails) {
        Sujet sujet = sujetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sujet not found with id: " + id));
        
        sujet.setTitre(sujetDetails.getTitre());
        sujet.setDescription(sujetDetails.getDescription());
        sujet.setPublier(sujetDetails.getPublier());
        sujet.setCoDirecteur(sujetDetails.getCoDirecteur());
        sujet.setFormationDoctorale(sujetDetails.getFormationDoctorale());
        sujet.setProfesseur(sujetDetails.getProfesseur());
        
        return sujetRepository.save(sujet);
    }

    // Delete
    public void delete(Long id) {
        if (!sujetRepository.existsById(id)) {
            throw new RuntimeException("Sujet not found with id: " + id);
        }
        sujetRepository.deleteById(id);
    }

    public void deleteAll() {
        sujetRepository.deleteAll();
    }

    public long count() {
        return sujetRepository.count();
    }
}
