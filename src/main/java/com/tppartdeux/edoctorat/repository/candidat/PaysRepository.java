package com.tppartdeux.edoctorat.repository.candidat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tppartdeux.edoctorat.model.candidat.Pays;

import java.util.Optional;

@Repository
public interface PaysRepository extends JpaRepository<Pays, Long> {
    Optional<Pays> findByNom(String nom);
}
