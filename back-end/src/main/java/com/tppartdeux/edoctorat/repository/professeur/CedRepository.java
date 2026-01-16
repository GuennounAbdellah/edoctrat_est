package com.tppartdeux.edoctorat.repository.professeur;

import com.tppartdeux.edoctorat.model.professeur.Ced;
import com.tppartdeux.edoctorat.model.professeur.Professeur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CedRepository extends JpaRepository<Ced, Long> {
    Optional<Ced> findByTitre(String titre);
    Optional<Ced> findByInitiale(String initiale);
    List<Ced> findByDirecteur(Professeur directeur);
}
