package com.tppartdeux.edoctorat.repository.professeur;

import com.tppartdeux.edoctorat.model.professeur.FormationDoctorale;
import com.tppartdeux.edoctorat.model.professeur.Ced;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FormationDoctoraleRepository extends JpaRepository<FormationDoctorale, Long> {
    Optional<FormationDoctorale> findByTitre(String titre);
    Optional<FormationDoctorale> findByInitiale(String initiale);
    List<FormationDoctorale> findByCed(Ced ced);
    List<FormationDoctorale> findByEtablissementId(String etablissementId);
}
