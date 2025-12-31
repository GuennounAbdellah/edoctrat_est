package com.tppartdeux.edoctorat.controller.condidat;

import com.tppartdeux.edoctorat.model.candidat.Candidat;
import com.tppartdeux.edoctorat.model.candidat.Postuler;
import com.tppartdeux.edoctorat.model.professeur.Sujet;
import com.tppartdeux.edoctorat.service.candidat.CandidatService;
import com.tppartdeux.edoctorat.service.candidat.PostulerService;
import com.tppartdeux.edoctorat.service.professeur.SujetService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PostulerController {

    @Autowired
    private final PostulerService postulerService;
    @Autowired
    private final CandidatService candidatService;
    @Autowired
    private final SujetService sujetService;

    @PostMapping("/add-postulation")
    public ResponseEntity<Postuler> addPostulation(@RequestParam("candidatId") Long candidatId,
                                                   @RequestParam("sujetId") Long sujetId,
                                                   @RequestParam("file") MultipartFile file) {
        Candidat candidat = candidatService.findById(candidatId).orElse(null);
        Sujet sujet = sujetService.findById(sujetId).orElse(null);

        if (candidat == null || sujet == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            Postuler p = Postuler.builder()
            .pathFile(file.toString())
            .candidat(candidat)
            .sujet(sujet)
            .build();
                Postuler postuler = postulerService.create(p);
            return new ResponseEntity<>(postuler, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/get-postulation-by-candidat-and-sujet/{candidatId}/{sujetId}")
    public ResponseEntity<Postuler> getPostulationByCandidatAndSujet(@PathVariable Long candidatId, @PathVariable Long sujetId) {
        Candidat candidat = candidatService.findById(candidatId).orElse(null);
        Sujet sujet = sujetService.findById(sujetId).orElse(null);

        if (candidat == null || sujet == null) {
            return ResponseEntity.notFound().build();
        }

        return postulerService.findByCandidatAndSujet(candidat, sujet)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/get-postulations-by-candidat/{id}")
    public ResponseEntity<List<Postuler>> getPostulationsByCandidat(@PathVariable Long id) {
        Candidat candidat = candidatService.findById(id).orElse(null);
        if (candidat == null) {
            return ResponseEntity.notFound().build();
        }
        List<Postuler> postulations = postulerService.findByCandidat(candidat);
        return ResponseEntity.ok(postulations);
    }

    @DeleteMapping("/delete-postulation/{id}")
    public ResponseEntity<Void> deletePostulation(@PathVariable Long id) {
        try {
            postulerService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    //CRUD Functions
    // Create
    @PostMapping
    public ResponseEntity<Postuler> create(@RequestBody Postuler postuler) {
        Postuler created = postulerService.create(postuler);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Read All
    @GetMapping
    public ResponseEntity<List<Postuler>> findAll() {
        List<Postuler> postulerList = postulerService.findAll();
        return ResponseEntity.ok(postulerList);
    }

    // Read By ID
    @GetMapping("/{id}")
    public ResponseEntity<Postuler> findById(@PathVariable Long id) {
        return postulerService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By Candidat
    @GetMapping("/candidat/{candidatId}")
    public ResponseEntity<List<Postuler>> findByCandidat(@PathVariable Long candidatId) {
        return candidatService.findById(candidatId)
                .map(candidat -> ResponseEntity.ok(postulerService.findByCandidat(candidat)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By Sujet
    @GetMapping("/sujet/{sujetId}")
    public ResponseEntity<List<Postuler>> findBySujet(@PathVariable Long sujetId) {
        return sujetService.findById(sujetId)
                .map(sujet -> ResponseEntity.ok(postulerService.findBySujet(sujet)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By Candidat and Sujet
    @GetMapping("/candidat/{candidatId}/sujet/{sujetId}")
    public ResponseEntity<Postuler> findByCandidatAndSujet(
            @PathVariable Long candidatId,
            @PathVariable Long sujetId) {
        return candidatService.findById(candidatId)
                .flatMap(candidat -> sujetService.findById(sujetId)
                        .flatMap(sujet -> postulerService.findByCandidatAndSujet(candidat, sujet)))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Postuler> update(@PathVariable Long id, @RequestBody Postuler postuler) {
        try {
            Postuler updated = postulerService.update(id, postuler);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            postulerService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete All
    @DeleteMapping
    public ResponseEntity<Void> deleteAll() {
        postulerService.deleteAll();
        return ResponseEntity.noContent().build();
    }

    // Count
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(postulerService.count());
    }
}
