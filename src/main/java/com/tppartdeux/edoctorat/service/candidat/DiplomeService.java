package com.tppartdeux.edoctorat.service.candidat;

import com.tppartdeux.edoctorat.model.candidat.Candidat;
import com.tppartdeux.edoctorat.model.candidat.Diplome;
import com.tppartdeux.edoctorat.repository.candidat.DiplomeRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class DiplomeService {

    @Autowired
    private final DiplomeRepository diplomeRepository;

    //CRUD Functions
    // Create
    public Diplome create(Diplome diplome) {
        return diplomeRepository.save(diplome);
    }

    // Read
    public List<Diplome> findAll() {
        return diplomeRepository.findAll();
    }

    public Optional<Diplome> findById(Long id) {
        return diplomeRepository.findById(id);
    }

    public List<Diplome> findByCandidat(Candidat candidat) {
        return diplomeRepository.findByCandidat(candidat);
    }

    public List<Diplome> findByType(String type) {
        return diplomeRepository.findByType(type);
    }

    public List<Diplome> findByPays(String pays) {
        return diplomeRepository.findByPays(pays);
    }

    // Update
    public Diplome update(Long id, Diplome diplomeDetails) {
        Diplome diplome = diplomeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diplome not found with id: " + id));
        
        diplome.setIntitule(diplomeDetails.getIntitule());
        diplome.setType(diplomeDetails.getType());
        diplome.setDateCommission(diplomeDetails.getDateCommission());
        diplome.setMention(diplomeDetails.getMention());
        diplome.setPays(diplomeDetails.getPays());
        diplome.setEtablissement(diplomeDetails.getEtablissement());
        diplome.setSpecialite(diplomeDetails.getSpecialite());
        diplome.setVille(diplomeDetails.getVille());
        diplome.setProvince(diplomeDetails.getProvince());
        diplome.setMoyenGenerale(diplomeDetails.getMoyenGenerale());
        diplome.setCandidat(diplomeDetails.getCandidat());
        
        return diplomeRepository.save(diplome);
    }

    // Delete
    public void delete(Long id) {
        if (!diplomeRepository.existsById(id)) {
            throw new RuntimeException("Diplome not found with id: " + id);
        }
        diplomeRepository.deleteById(id);
    }

    public void deleteAll() {
        diplomeRepository.deleteAll();
    }

    public long count() {
        return diplomeRepository.count();
    }
}
