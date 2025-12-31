package com.tppartdeux.edoctorat.service.professeur;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tppartdeux.edoctorat.repository.professeur.DirecteurPoleCalendrierRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class DirecteurPoleCalendrierService {

    @Autowired
    private final DirecteurPoleCalendrierRepository directeurPoleCalendrierRepository;

    //CRUD Functions
    // Create
    public com.tppartdeux.edoctorat.model.professeur.DirecteurPoleCalendrier create(com.tppartdeux.edoctorat.model.professeur.DirecteurPoleCalendrier directeurPoleCalendrier) {
        return directeurPoleCalendrierRepository.save(directeurPoleCalendrier);
    }

    // Read
    public List<com.tppartdeux.edoctorat.model.professeur.DirecteurPoleCalendrier> findAll() {
        return directeurPoleCalendrierRepository.findAll();
    }

    public Optional<com.tppartdeux.edoctorat.model.professeur.DirecteurPoleCalendrier> findById(Integer id) {
        return directeurPoleCalendrierRepository.findById(id);
    }

    public List<com.tppartdeux.edoctorat.model.professeur.DirecteurPoleCalendrier> findByPour(String pour) {
        return directeurPoleCalendrierRepository.findByPour(pour);
    }

    public List<com.tppartdeux.edoctorat.model.professeur.DirecteurPoleCalendrier> findByDateDebutBetween(LocalDate startDate, LocalDate endDate) {
        return directeurPoleCalendrierRepository.findByDateDebutBetween(startDate, endDate);
    }

    public List<com.tppartdeux.edoctorat.model.professeur.DirecteurPoleCalendrier> findByDateFinBetween(LocalDate startDate, LocalDate endDate) {
        return directeurPoleCalendrierRepository.findByDateFinBetween(startDate, endDate);
    }

    // Update
    public com.tppartdeux.edoctorat.model.professeur.DirecteurPoleCalendrier update(Integer id, com.tppartdeux.edoctorat.model.professeur.DirecteurPoleCalendrier directeurPoleCalendrierDetails) {
        com.tppartdeux.edoctorat.model.professeur.DirecteurPoleCalendrier directeurPoleCalendrier = directeurPoleCalendrierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DirecteurPoleCalendrier not found with id: " + id));
        
        directeurPoleCalendrier.setAction(directeurPoleCalendrierDetails.getAction());
        directeurPoleCalendrier.setDateDebut(directeurPoleCalendrierDetails.getDateDebut());
        directeurPoleCalendrier.setDateFin(directeurPoleCalendrierDetails.getDateFin());
        directeurPoleCalendrier.setPour(directeurPoleCalendrierDetails.getPour());
        
        return directeurPoleCalendrierRepository.save(directeurPoleCalendrier);
    }

    // Delete
    public void delete(Integer id) {
        if (!directeurPoleCalendrierRepository.existsById(id)) {
            throw new RuntimeException("DirecteurPoleCalendrier not found with id: " + id);
        }
        directeurPoleCalendrierRepository.deleteById(id);
    }

    public void deleteAll() {
        directeurPoleCalendrierRepository.deleteAll();
    }

    public long count() {
        return directeurPoleCalendrierRepository.count();
    }
}
