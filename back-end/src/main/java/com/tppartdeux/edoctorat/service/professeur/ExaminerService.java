package com.tppartdeux.edoctorat.service.professeur;

import com.tppartdeux.edoctorat.dto.professeur.PostulerJoinedResponse;
import com.tppartdeux.edoctorat.model.professeur.Examiner;
import com.tppartdeux.edoctorat.model.candidat.Candidat;
import com.tppartdeux.edoctorat.model.professeur.Commission;
import com.tppartdeux.edoctorat.model.professeur.Sujet;
import com.tppartdeux.edoctorat.repository.professeur.ExaminerRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ExaminerService {

    @Autowired
    private final ExaminerRepository examinerRepository;

    //CRUD Functions
    // Create
    public Examiner create(Examiner examiner) {
        return examinerRepository.save(examiner);
    }

    // Read
    public List<Examiner> findAll() {
        return examinerRepository.findAll();
    }

    public Optional<Examiner> findById(Long id) {
        return examinerRepository.findById(id);
    }

    public List<Examiner> findByCommission(Commission commission) {
        return examinerRepository.findByCommission(commission);
    }

    public List<Examiner> findBySujet(Sujet sujet) {
        return examinerRepository.findBySujet(sujet);
    }

    public List<Examiner> findByCandidat(Candidat candidat) {
        return examinerRepository.findByCandidat(candidat);
    }

    public List<Examiner> findByPublier(Boolean publier) {
        return examinerRepository.findByPublier(publier);
    }

    public List<Examiner> findByValider(Boolean valider) {
        return examinerRepository.findByValider(valider);
    }

    // Method to get all examiners which includes candidat and sujet information
    public List<Examiner> findAllWithCandidatsAndSujets() {
        return examinerRepository.findAll();
    }

    // Method to get postuler joined data with all related information
    public List<PostulerJoinedResponse> findAllPostulerJoinedData() {
        return examinerRepository.findPostulerJoinedData();
    }

    public Optional<Examiner> findByCandidatAndSujet(Candidat candidat, Sujet sujet) {
        return examinerRepository.findByCandidatAndSujet(candidat, sujet);
    }

    // Update
    public Examiner update(Long id, Examiner examinerDetails) {
        Examiner examiner = examinerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Examiner not found with id: " + id));
        
        examiner.setDecision(examinerDetails.getDecision());
        examiner.setNoteDossier(examinerDetails.getNoteDossier());
        examiner.setNoteEntretien(examinerDetails.getNoteEntretien());
        examiner.setPublier(examinerDetails.getPublier());
        examiner.setCommission(examinerDetails.getCommission());
        examiner.setSujet(examinerDetails.getSujet());
        examiner.setCandidat(examinerDetails.getCandidat());
        examiner.setValider(examinerDetails.getValider());
        
        return examinerRepository.save(examiner);
    }

    // Delete
    public void delete(Long id) {
        if (!examinerRepository.existsById(id)) {
            throw new RuntimeException("Examiner not found with id: " + id);
        }
        examinerRepository.deleteById(id);
    }

    public void deleteAll() {
        examinerRepository.deleteAll();
    }

    public long count() {
        return examinerRepository.count();
    }
}
