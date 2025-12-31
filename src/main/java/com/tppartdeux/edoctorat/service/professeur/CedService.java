package com.tppartdeux.edoctorat.service.professeur;

import com.tppartdeux.edoctorat.model.professeur.Ced;
import com.tppartdeux.edoctorat.model.professeur.Professeur;
import com.tppartdeux.edoctorat.repository.professeur.CedRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CedService {

    @Autowired
    private final CedRepository cedRepository;

    //CRUD Functions
    // Create
    public Ced create(Ced ced) {
        return cedRepository.save(ced);
    }

    // Read
    public List<Ced> findAll() {
        return cedRepository.findAll();
    }

    public Optional<Ced> findById(Long id) {
        return cedRepository.findById(id);
    }

    public Optional<Ced> findByTitre(String titre) {
        return cedRepository.findByTitre(titre);
    }

    public Optional<Ced> findByInitiale(String initiale) {
        return cedRepository.findByInitiale(initiale);
    }

    public List<Ced> findByDirecteur(Professeur directeur) {
        return cedRepository.findByDirecteur(directeur);
    }

    // Update
    public Ced update(Long id, Ced cedDetails) {
        Ced ced = cedRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ced not found with id: " + id));
        
        ced.setDescription(cedDetails.getDescription());
        ced.setPathImage(cedDetails.getPathImage());
        ced.setInitiale(cedDetails.getInitiale());
        ced.setTitre(cedDetails.getTitre());
        ced.setDirecteur(cedDetails.getDirecteur());
        
        return cedRepository.save(ced);
    }

    // Delete
    public void delete(Long id) {
        if (!cedRepository.existsById(id)) {
            throw new RuntimeException("Ced not found with id: " + id);
        }
        cedRepository.deleteById(id);
    }

    public void deleteAll() {
        cedRepository.deleteAll();
    }

    public long count() {
        return cedRepository.count();
    }
}
