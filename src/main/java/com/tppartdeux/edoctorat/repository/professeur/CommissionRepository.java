package com.tppartdeux.edoctorat.repository.professeur;

import com.tppartdeux.edoctorat.model.professeur.Commission;
import com.tppartdeux.edoctorat.model.professeur.Laboratoire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CommissionRepository extends JpaRepository<Commission, Long> {
    List<Commission> findByLabo(Laboratoire labo);
    List<Commission> findByDateCommission(LocalDate dateCommission);
    List<Commission> findByDateCommissionBetween(LocalDate startDate, LocalDate endDate);
}
