package com.tppartdeux.edoctorat.repository.professeur;

import com.tppartdeux.edoctorat.model.professeur.Examiner;
import com.tppartdeux.edoctorat.model.candidat.Candidat;
import com.tppartdeux.edoctorat.model.professeur.Commission;
import com.tppartdeux.edoctorat.model.professeur.Sujet;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExaminerRepository extends JpaRepository<Examiner, Long> {
    List<Examiner> findByCommission(Commission commission);
    List<Examiner> findBySujet(Sujet sujet);
    List<Examiner> findByCandidat(Candidat candidat);
    List<Examiner> findByPublier(Boolean publier);
    List<Examiner> findByValider(Boolean valider);
    Optional<Examiner> findByCandidatAndSujet(Candidat candidat, Sujet sujet);
}
