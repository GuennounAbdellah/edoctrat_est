package com.tppartdeux.edoctorat.controller.professeur;

import com.tppartdeux.edoctorat.model.professeur.Professeur;
import com.tppartdeux.edoctorat.service.professeur.ProfesseurService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professeur/professeurs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfesseurController {

    @Autowired
    private final ProfesseurService professeurService;

    // Create
    @PostMapping
    public ResponseEntity<Professeur> create(@RequestBody Professeur professeur) {
        Professeur created = professeurService.create(professeur);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Read All
    @GetMapping
    public ResponseEntity<List<Professeur>> findAll() {
        List<Professeur> professeurs = professeurService.findAll();
        return ResponseEntity.ok(professeurs);
    }

    // Read By ID
    @GetMapping("/{id}")
    public ResponseEntity<Professeur> findById(@PathVariable Long id) {
        return professeurService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By CIN
    @GetMapping("/cin/{cin}")
    public ResponseEntity<Professeur> findByCin(@PathVariable String cin) {
        return professeurService.findByCin(cin)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By User ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<Professeur> findByUser(@PathVariable Integer userId) {
        return professeurService.findByUser(
                com.tppartdeux.edoctorat.model.auth.User.builder().id(userId).build()
        )
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By Etablissement
    @GetMapping("/etablissement/{etablissementId}")
    public ResponseEntity<List<Professeur>> findByEtablissementId(@PathVariable String etablissementId) {
        List<Professeur> professeurs = professeurService.findByEtablissementId(etablissementId);
        return ResponseEntity.ok(professeurs);
    }

    // Read By Grade
    @GetMapping("/grade/{grade}")
    public ResponseEntity<List<Professeur>> findByGrade(@PathVariable String grade) {
        List<Professeur> professeurs = professeurService.findByGrade(grade);
        return ResponseEntity.ok(professeurs);
    }

    // Check if CIN exists
    @GetMapping("/exists/cin/{cin}")
    public ResponseEntity<Boolean> existsByCin(@PathVariable String cin) {
        return ResponseEntity.ok(professeurService.existsByCin(cin));
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Professeur> update(@PathVariable Long id, @RequestBody Professeur professeur) {
        try {
            Professeur updated = professeurService.update(id, professeur);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            professeurService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete All
    @DeleteMapping
    public ResponseEntity<Void> deleteAll() {
        professeurService.deleteAll();
        return ResponseEntity.noContent().build();
    }

    // Count
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(professeurService.count());
    }
}
