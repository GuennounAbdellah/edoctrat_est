package com.tppartdeux.edoctorat.service.professeur;

import com.tppartdeux.edoctorat.model.professeur.Professeur;
import com.tppartdeux.edoctorat.model.auth.User;
import com.tppartdeux.edoctorat.repository.professeur.ProfesseurRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfesseurService {

    @Autowired
    private final ProfesseurRepository professeurRepository;

    //CRUD Functions
    // Create
    public Professeur create(Professeur professeur) {
        return professeurRepository.save(professeur);
    }

    // Read
    public List<Professeur> findAll() {
        return professeurRepository.findAll();
    }

    public Optional<Professeur> findById(Long id) {
        return professeurRepository.findById(id);
    }

    public Optional<Professeur> findByCin(String cin) {
        return professeurRepository.findByCin(cin);
    }

    public Optional<Professeur> findByUser(User user) {
        return professeurRepository.findByUser(user);
    }

    public List<Professeur> findByEtablissementId(String etablissementId) {
        return professeurRepository.findByEtablissementId(etablissementId);
    }

    public List<Professeur> findByGrade(String grade) {
        return professeurRepository.findByGrade(grade);
    }

    public boolean existsByCin(String cin) {
        return professeurRepository.existsByCin(cin);
    }

    // Update
    public Professeur update(Long id, Professeur professeurDetails) {
        Professeur professeur = professeurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professeur not found with id: " + id));
        
        professeur.setCin(professeurDetails.getCin());
        professeur.setTelProfesseur(professeurDetails.getTelProfesseur());
        professeur.setPathPhoto(professeurDetails.getPathPhoto());
        professeur.setGrade(professeurDetails.getGrade());
        professeur.setNumSOM(professeurDetails.getNumSOM());
        professeur.setNombreEncadrer(professeurDetails.getNombreEncadrer());
        professeur.setNombreProposer(professeurDetails.getNombreProposer());
        professeur.setEtablissementId(professeurDetails.getEtablissementId());
        professeur.setLabo(professeurDetails.getLabo());
        professeur.setUser(professeurDetails.getUser());
        
        return professeurRepository.save(professeur);
    }

    // Delete
    public void delete(Long id) {
        if (!professeurRepository.existsById(id)) {
            throw new RuntimeException("Professeur not found with id: " + id);
        }
        professeurRepository.deleteById(id);
    }

    public void deleteAll() {
        professeurRepository.deleteAll();
    }

    public long count() {
        return professeurRepository.count();
    }
}
