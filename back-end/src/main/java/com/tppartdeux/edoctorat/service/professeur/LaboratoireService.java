package com.tppartdeux.edoctorat.service.professeur;

import com.tppartdeux.edoctorat.model.professeur.Laboratoire;
import com.tppartdeux.edoctorat.model.professeur.Ced;
import com.tppartdeux.edoctorat.model.professeur.Professeur;
import com.tppartdeux.edoctorat.repository.professeur.LaboratoireRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class LaboratoireService {

    @Autowired
    private final LaboratoireRepository laboratoireRepository;

    //CRUD Functions
    // Create
    public Laboratoire create(Laboratoire laboratoire) {
        return laboratoireRepository.save(laboratoire);
    }

    // Read
    public List<Laboratoire> findAll() {
        return laboratoireRepository.findAll();
    }

    public Optional<Laboratoire> findById(Long id) {
        return laboratoireRepository.findById(id);
    }

    public Optional<Laboratoire> findByNomLaboratoire(String nomLaboratoire) {
        return laboratoireRepository.findByNomLaboratoire(nomLaboratoire);
    }

    public Optional<Laboratoire> findByInitial(String initial) {
        return laboratoireRepository.findByInitial(initial);
    }

    public List<Laboratoire> findByCed(Ced ced) {
        return laboratoireRepository.findByCed(ced);
    }

    public List<Laboratoire> findByDirecteur(Professeur directeur) {
        return laboratoireRepository.findByDirecteur(directeur);
    }

    public List<Laboratoire> findByEtablissementId(String etablissementId) {
        return laboratoireRepository.findByEtablissementId(etablissementId);
    }

    // Update
    public Laboratoire update(Long id, Laboratoire laboratoireDetails) {
        Laboratoire laboratoire = laboratoireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Laboratoire not found with id: " + id));
        
        laboratoire.setNomLaboratoire(laboratoireDetails.getNomLaboratoire());
        laboratoire.setDescription(laboratoireDetails.getDescription());
        laboratoire.setPathImage(laboratoireDetails.getPathImage());
        laboratoire.setInitial(laboratoireDetails.getInitial());
        laboratoire.setCed(laboratoireDetails.getCed());
        laboratoire.setDirecteur(laboratoireDetails.getDirecteur());
        laboratoire.setEtablissementId(laboratoireDetails.getEtablissementId());
        
        return laboratoireRepository.save(laboratoire);
    }

    // Delete
    public void delete(Long id) {
        if (!laboratoireRepository.existsById(id)) {
            throw new RuntimeException("Laboratoire not found with id: " + id);
        }
        laboratoireRepository.deleteById(id);
    }

    public void deleteAll() {
        laboratoireRepository.deleteAll();
    }

    public long count() {
        return laboratoireRepository.count();
    }
}
