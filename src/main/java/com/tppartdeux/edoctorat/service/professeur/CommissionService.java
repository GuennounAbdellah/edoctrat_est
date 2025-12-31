package com.tppartdeux.edoctorat.service.professeur;

import com.tppartdeux.edoctorat.model.professeur.Commission;
import com.tppartdeux.edoctorat.model.professeur.Laboratoire;
import com.tppartdeux.edoctorat.repository.professeur.CommissionRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CommissionService {

    @Autowired
    private final CommissionRepository commissionRepository;

    //CRUD Functions
    // Create
    public Commission create(Commission commission) {
        return commissionRepository.save(commission);
    }

    // Read
    public List<Commission> findAll() {
        return commissionRepository.findAll();
    }

    public Optional<Commission> findById(Long id) {
        return commissionRepository.findById(id);
    }

    public List<Commission> findByLabo(Laboratoire labo) {
        return commissionRepository.findByLabo(labo);
    }

    public List<Commission> findByDateCommission(LocalDate dateCommission) {
        return commissionRepository.findByDateCommission(dateCommission);
    }

    public List<Commission> findByDateCommissionBetween(LocalDate startDate, LocalDate endDate) {
        return commissionRepository.findByDateCommissionBetween(startDate, endDate);
    }

    // Update
    public Commission update(Long id, Commission commissionDetails) {
        Commission commission = commissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commission not found with id: " + id));
        
        commission.setDateCommission(commissionDetails.getDateCommission());
        commission.setLieu(commissionDetails.getLieu());
        commission.setHeure(commissionDetails.getHeure());
        commission.setLabo(commissionDetails.getLabo());
        
        return commissionRepository.save(commission);
    }

    // Delete
    public void delete(Long id) {
        if (!commissionRepository.existsById(id)) {
            throw new RuntimeException("Commission not found with id: " + id);
        }
        commissionRepository.deleteById(id);
    }

    public void deleteAll() {
        commissionRepository.deleteAll();
    }

    public long count() {
        return commissionRepository.count();
    }
}
