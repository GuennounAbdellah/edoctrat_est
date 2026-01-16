package com.tppartdeux.edoctorat.repository.professeur;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DirecteurPoleCalendrierRepository extends JpaRepository<com.tppartdeux.edoctorat.model.professeur.DirecteurPoleCalendrier, Integer> {
    List<com.tppartdeux.edoctorat.model.professeur.DirecteurPoleCalendrier> findByPour(String pour);
    List<com.tppartdeux.edoctorat.model.professeur.DirecteurPoleCalendrier> findByDateDebutBetween(LocalDate startDate, LocalDate endDate);
    List<com.tppartdeux.edoctorat.model.professeur.DirecteurPoleCalendrier> findByDateFinBetween(LocalDate startDate, LocalDate endDate);
}
