package com.tppartdeux.edoctorat.repository.candidat;

import com.tppartdeux.edoctorat.model.candidat.Candidat;
import com.tppartdeux.edoctorat.model.candidat.Postuler;
import com.tppartdeux.edoctorat.model.professeur.Sujet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostulerRepository extends JpaRepository<Postuler, Long> {
    List<Postuler> findByCandidat(Candidat candidat);
    List<Postuler> findBySujet(Sujet sujet);
    Optional<Postuler> findByCandidatAndSujet(Candidat candidat, Sujet sujet);
}
