package com.tppartdeux.edoctorat.service.professeur;

import com.tppartdeux.edoctorat.model.professeur.FormationDoctorale;
import com.tppartdeux.edoctorat.model.professeur.Ced;
import com.tppartdeux.edoctorat.repository.professeur.FormationDoctoraleRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class FormationDoctoraleService {

    @Autowired
    private final FormationDoctoraleRepository formationDoctoraleRepository;

    //CRUD Functions
    // Create
    public FormationDoctorale create(FormationDoctorale formationDoctorale) {
        return formationDoctoraleRepository.save(formationDoctorale);
    }

    // Read
    public List<FormationDoctorale> findAll() {
        return formationDoctoraleRepository.findAll();
    }

    public Optional<FormationDoctorale> findById(Long id) {
        return formationDoctoraleRepository.findById(id);
    }

    public Optional<FormationDoctorale> findByTitre(String titre) {
        return formationDoctoraleRepository.findByTitre(titre);
    }

    public Optional<FormationDoctorale> findByInitiale(String initiale) {
        return formationDoctoraleRepository.findByInitiale(initiale);
    }

    public List<FormationDoctorale> findByCed(Ced ced) {
        return formationDoctoraleRepository.findByCed(ced);
    }

    public List<FormationDoctorale> findByEtablissementId(String etablissementId) {
        return formationDoctoraleRepository.findByEtablissementId(etablissementId);
    }

    // Update
    public FormationDoctorale update(Long id, FormationDoctorale formationDoctoraleDetails) {
        FormationDoctorale formationDoctorale = formationDoctoraleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FormationDoctorale not found with id: " + id));
        
        formationDoctorale.setPathImage(formationDoctoraleDetails.getPathImage());
        formationDoctorale.setInitiale(formationDoctoraleDetails.getInitiale());
        formationDoctorale.setTitre(formationDoctoraleDetails.getTitre());
        formationDoctorale.setAxeDeRecherche(formationDoctoraleDetails.getAxeDeRecherche());
        formationDoctorale.setDateAccreditation(formationDoctoraleDetails.getDateAccreditation());
        formationDoctorale.setCed(formationDoctoraleDetails.getCed());
        formationDoctorale.setEtablissementId(formationDoctoraleDetails.getEtablissementId());
        
        return formationDoctoraleRepository.save(formationDoctorale);
    }

    // Delete
    public void delete(Long id) {
        if (!formationDoctoraleRepository.existsById(id)) {
            throw new RuntimeException("FormationDoctorale not found with id: " + id);
        }
        formationDoctoraleRepository.deleteById(id);
    }

    public void deleteAll() {
        formationDoctoraleRepository.deleteAll();
    }

    public long count() {
        return formationDoctoraleRepository.count();
    }
}
