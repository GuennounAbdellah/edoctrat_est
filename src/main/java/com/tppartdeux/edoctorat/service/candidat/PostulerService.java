package com.tppartdeux.edoctorat.service.candidat;

import com.tppartdeux.edoctorat.model.candidat.Candidat;
import com.tppartdeux.edoctorat.model.candidat.Postuler;
import com.tppartdeux.edoctorat.model.professeur.Sujet;
import com.tppartdeux.edoctorat.repository.candidat.PostulerRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class PostulerService {

    @Autowired
    private final PostulerRepository postulerRepository;

    //CRUD Functions
    // Create
    public Postuler create(Postuler postuler) {
        return postulerRepository.save(postuler);
    }

    // Read
    public List<Postuler> findAll() {
        return postulerRepository.findAll();
    }

    public Optional<Postuler> findById(Long id) {
        return postulerRepository.findById(id);
    }

    public List<Postuler> findByCandidat(Candidat candidat) {
        return postulerRepository.findByCandidat(candidat);
    }

    public List<Postuler> findBySujet(Sujet sujet) {
        return postulerRepository.findBySujet(sujet);
    }

    public Optional<Postuler> findByCandidatAndSujet(Candidat candidat, Sujet sujet) {
        return postulerRepository.findByCandidatAndSujet(candidat, sujet);
    }

    // Update
    public Postuler update(Long id, Postuler postulerDetails) {
        Postuler postuler = postulerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Postuler not found with id: " + id));
        
        postuler.setPathFile(postulerDetails.getPathFile());
        postuler.setCandidat(postulerDetails.getCandidat());
        postuler.setSujet(postulerDetails.getSujet());
        
        return postulerRepository.save(postuler);
    }

    // Delete
    public void delete(Long id) {
        if (!postulerRepository.existsById(id)) {
            throw new RuntimeException("Postuler not found with id: " + id);
        }
        postulerRepository.deleteById(id);
    }

    public void deleteAll() {
        postulerRepository.deleteAll();
    }

    public long count() {
        return postulerRepository.count();
    }
}
