package com.tppartdeux.edoctorat.repository.professeur;

import com.tppartdeux.edoctorat.model.professeur.Laboratoire;
import com.tppartdeux.edoctorat.model.professeur.Ced;
import com.tppartdeux.edoctorat.model.professeur.Professeur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LaboratoireRepository extends JpaRepository<Laboratoire, Long> {
    Optional<Laboratoire> findByNomLaboratoire(String nomLaboratoire);
    Optional<Laboratoire> findByInitial(String initial);
    List<Laboratoire> findByCed(Ced ced);
    List<Laboratoire> findByDirecteur(Professeur directeur);
    List<Laboratoire> findByEtablissementId(String etablissementId);
}
