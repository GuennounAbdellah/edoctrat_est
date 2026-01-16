package com.tppartdeux.edoctorat.service.candidat;

import com.tppartdeux.edoctorat.model.candidat.Annexe;
import com.tppartdeux.edoctorat.model.candidat.Diplome;
import com.tppartdeux.edoctorat.repository.candidat.AnnexeRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class AnnexeService {

    @Autowired
    private final AnnexeRepository annexeRepository;

    //CRUD Functions
    // Create
    public Annexe create(Annexe annexe) {
        return annexeRepository.save(annexe);
    }

    // Read
    public List<Annexe> findAll() {
        return annexeRepository.findAll();
    }

    public Optional<Annexe> findById(Long id) {
        return annexeRepository.findById(id);
    }

    public List<Annexe> findByDiplome(Diplome diplome) {
        return annexeRepository.findByDiplome(diplome);
    }

    public List<Annexe> findByTypeAnnexe(String typeAnnexe) {
        return annexeRepository.findByTypeAnnexe(typeAnnexe);
    }

    // Update
    public Annexe update(Long id, Annexe annexeDetails) {
        Annexe annexe = annexeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Annexe not found with id: " + id));
        
        annexe.setTypeAnnexe(annexeDetails.getTypeAnnexe());
        annexe.setTitre(annexeDetails.getTitre());
        annexe.setPathFile(annexeDetails.getPathFile());
        annexe.setDiplome(annexeDetails.getDiplome());
        
        return annexeRepository.save(annexe);
    }

    // Delete
    public void delete(Long id) {
        if (!annexeRepository.existsById(id)) {
            throw new RuntimeException("Annexe not found with id: " + id);
        }
        annexeRepository.deleteById(id);
    }

    public void deleteAll() {
        annexeRepository.deleteAll();
    }

    public long count() {
        return annexeRepository.count();
    }
}
