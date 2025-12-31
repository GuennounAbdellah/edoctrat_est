package com.tppartdeux.edoctorat.service.candidat;

import com.tppartdeux.edoctorat.model.candidat.Pays;
import com.tppartdeux.edoctorat.repository.candidat.PaysRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class PaysService {

    @Autowired
    private final PaysRepository paysRepository;

    //CRUD Functions
    // Create
    public Pays create(Pays pays) {
        return paysRepository.save(pays);
    }

    // Read
    public List<Pays> findAll() {
        return paysRepository.findAll();
    }

    public Optional<Pays> findById(Long id) {
        return paysRepository.findById(id);
    }

    public Optional<Pays> findByNom(String nom) {
        return paysRepository.findByNom(nom);
    }

    // Update
    public Pays update(Long id, Pays paysDetails) {
        Pays pays = paysRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pays not found with id: " + id));
        
        pays.setNom(paysDetails.getNom());
        
        return paysRepository.save(pays);
    }

    // Delete
    public void delete(Long id) {
        if (!paysRepository.existsById(id)) {
            throw new RuntimeException("Pays not found with id: " + id);
        }
        paysRepository.deleteById(id);
    }

    public void deleteAll() {
        paysRepository.deleteAll();
    }

    public long count() {
        return paysRepository.count();
    }
}
