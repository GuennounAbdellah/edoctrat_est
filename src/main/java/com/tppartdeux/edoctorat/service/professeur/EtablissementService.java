package com.tppartdeux.edoctorat.service.professeur;

import com.tppartdeux.edoctorat.model.professeur.Etablissement;
import com.tppartdeux.edoctorat.repository.professeur.EtablissementRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class EtablissementService {

    @Autowired
    private final EtablissementRepository etablissementRepository;

    //CRUD Functions
    // Create
    public Etablissement create(Etablissement etablissement) {
        return etablissementRepository.save(etablissement);
    }

    // Read
    public List<Etablissement> findAll() {
        return etablissementRepository.findAll();
    }

    public Optional<Etablissement> findById(String id) {
        return etablissementRepository.findById(id);
    }

    public Optional<Etablissement> findByNomEtablissement(String nomEtablissement) {
        return etablissementRepository.findByNomEtablissement(nomEtablissement);
    }

    // Update
    public Etablissement update(String id, Etablissement etablissementDetails) {
        Etablissement etablissement = etablissementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Etablissement not found with id: " + id));
        
        etablissement.setNomEtablissement(etablissementDetails.getNomEtablissement());
        
        return etablissementRepository.save(etablissement);
    }

    // Delete
    public void delete(String id) {
        if (!etablissementRepository.existsById(id)) {
            throw new RuntimeException("Etablissement not found with id: " + id);
        }
        etablissementRepository.deleteById(id);
    }

    public void deleteAll() {
        etablissementRepository.deleteAll();
    }

    public long count() {
        return etablissementRepository.count();
    }
}
