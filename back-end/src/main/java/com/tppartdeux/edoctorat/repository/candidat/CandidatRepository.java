package com.tppartdeux.edoctorat.repository.candidat;

import java.util.List;
import java.util.Optional;

import com.tppartdeux.edoctorat.model.candidat.Candidat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tppartdeux.edoctorat.model.auth.User;

@Repository
public interface CandidatRepository extends JpaRepository <Candidat, Long> {

    Optional<Candidat> findByCin(String cin);

    @Query("SELECT c FROM Candidat c LEFT JOIN FETCH c.user LEFT JOIN FETCH c.pays WHERE c.cne = :cne")
    Optional<Candidat> findByCneWithUserAndPays(@Param("cne") String cne);

    Optional<Candidat> findByUser(User user);

    List<Candidat> findByEtatDossier(Integer etatDossier);

    boolean existsByCin(String cin);

    boolean existsByCne(String cne);
    
}
