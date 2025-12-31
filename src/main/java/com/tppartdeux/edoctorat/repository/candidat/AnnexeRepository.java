package com.tppartdeux.edoctorat.repository.candidat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tppartdeux.edoctorat.model.candidat.Annexe;
import com.tppartdeux.edoctorat.model.candidat.Diplome;

import java.util.List;

@Repository
public interface AnnexeRepository extends JpaRepository<Annexe, Long> {
    List<Annexe> findByDiplome(Diplome diplome);
    List<Annexe> findByTypeAnnexe(String typeAnnexe);
}
