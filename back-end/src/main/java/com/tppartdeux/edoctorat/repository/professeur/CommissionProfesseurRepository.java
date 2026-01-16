package com.tppartdeux.edoctorat.repository.professeur;

import com.tppartdeux.edoctorat.model.professeur.CommissionProfesseurs;
import com.tppartdeux.edoctorat.model.professeur.Commission;
import com.tppartdeux.edoctorat.model.professeur.Professeur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommissionProfesseurRepository extends JpaRepository<CommissionProfesseurs, Long> {
    List<CommissionProfesseurs> findByCommission(Commission commission);
    List<CommissionProfesseurs> findByProfesseur(Professeur professeur);
}
