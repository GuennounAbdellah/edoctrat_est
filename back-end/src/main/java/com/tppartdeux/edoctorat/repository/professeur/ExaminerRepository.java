package com.tppartdeux.edoctorat.repository.professeur;

import com.tppartdeux.edoctorat.model.professeur.Examiner;
import com.tppartdeux.edoctorat.model.candidat.Candidat;
import com.tppartdeux.edoctorat.model.professeur.Commission;
import com.tppartdeux.edoctorat.model.professeur.Sujet;

import com.tppartdeux.edoctorat.dto.professeur.PostulerJoinedResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
    
    @Query(value = "SELECT new com.tppartdeux.edoctorat.dto.professeur.PostulerJoinedResponse(" +
            "    p.id," +
            "    c.cne," +
            "    COALESCE(c.nomCandidatAr, '')," +
            "    COALESCE(c.prenomCandidatAr, '')," +
            "    COALESCE(s.titre, '')," +
            "    COALESCE(profDirecteur.user.lastName, '')," +
            "    COALESCE(profDirecteur.user.firstName, '')," +
            "    COALESCE(profCoDir.user.lastName, '')," +
            "    COALESCE(profCoDir.user.firstName, '')," +
            "    COALESCE(fd.titre, '')" +
            ") " +
            "FROM Examiner p " +
            "JOIN p.candidat c " +
            "JOIN p.sujet s " +
            "JOIN s.professeur profDirecteur " +
            "LEFT JOIN s.coDirecteur profCoDir " +
            "JOIN s.formationDoctorale fd")
    List<PostulerJoinedResponse> findPostulerJoinedData();
}
