package com.tppartdeux.edoctorat.repository.professeur;

import com.tppartdeux.edoctorat.model.candidat.Candidat;
import com.tppartdeux.edoctorat.model.professeur.Inscription;
import com.tppartdeux.edoctorat.model.professeur.Sujet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InscriptionRepository extends JpaRepository<Inscription, Long> {
    List<Inscription> findByCandidat(Candidat candidat);
    List<Inscription> findBySujet(Sujet sujet);
    List<Inscription> findByValider(Boolean valider);
    Optional<Inscription> findByCandidatAndSujet(Candidat candidat, Sujet sujet);
}
