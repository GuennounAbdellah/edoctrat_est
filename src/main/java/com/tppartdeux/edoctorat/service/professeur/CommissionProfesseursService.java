package com.tppartdeux.edoctorat.service.professeur;

import com.tppartdeux.edoctorat.model.professeur.CommissionProfesseurs;
import com.tppartdeux.edoctorat.model.professeur.Commission;
import com.tppartdeux.edoctorat.model.professeur.Professeur;
import com.tppartdeux.edoctorat.repository.professeur.CommissionProfesseurRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CommissionProfesseursService {

    @Autowired
    private final CommissionProfesseurRepository commissionProfesseurRepository;

    //CRUD Functions
    // Create
    public CommissionProfesseurs create(CommissionProfesseurs commissionProfesseurs) {
        return commissionProfesseurRepository.save(commissionProfesseurs);
    }

    // Read
    public List<CommissionProfesseurs> findAll() {
        return commissionProfesseurRepository.findAll();
    }

    public Optional<CommissionProfesseurs> findById(Long id) {
        return commissionProfesseurRepository.findById(id);
    }

    public List<CommissionProfesseurs> findByCommission(Commission commission) {
        return commissionProfesseurRepository.findByCommission(commission);
    }

    public List<CommissionProfesseurs> findByProfesseur(Professeur professeur) {
        return commissionProfesseurRepository.findByProfesseur(professeur);
    }

    // Update
    public CommissionProfesseurs update(Long id, CommissionProfesseurs commissionProfesseursDetails) {
        CommissionProfesseurs commissionProfesseurs = commissionProfesseurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CommissionProfesseurs not found with id: " + id));
        
        commissionProfesseurs.setCommission(commissionProfesseursDetails.getCommission());
        commissionProfesseurs.setProfesseur(commissionProfesseursDetails.getProfesseur());
        
        return commissionProfesseurRepository.save(commissionProfesseurs);
    }

    // Delete
    public void delete(Long id) {
        if (!commissionProfesseurRepository.existsById(id)) {
            throw new RuntimeException("CommissionProfesseurs not found with id: " + id);
        }
        commissionProfesseurRepository.deleteById(id);
    }

    public long count() {
        return commissionProfesseurRepository.count();
    }
}
