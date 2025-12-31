package com.tppartdeux.edoctorat.controller.professeur;

import com.tppartdeux.edoctorat.model.professeur.Laboratoire;
import com.tppartdeux.edoctorat.model.professeur.Ced;
import com.tppartdeux.edoctorat.model.professeur.Professeur;
import com.tppartdeux.edoctorat.service.professeur.LaboratoireService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professeur/laboratoires")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LaboratoireController {

    @Autowired
    private final LaboratoireService laboratoireService;

    // Create
    @PostMapping
    public ResponseEntity<Laboratoire> create(@RequestBody Laboratoire laboratoire) {
        Laboratoire created = laboratoireService.create(laboratoire);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Read All
    @GetMapping
    public ResponseEntity<List<Laboratoire>> findAll() {
        List<Laboratoire> laboratoires = laboratoireService.findAll();
        return ResponseEntity.ok(laboratoires);
    }

    // Read By ID
    @GetMapping("/{id}")
    public ResponseEntity<Laboratoire> findById(@PathVariable Long id) {
        return laboratoireService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By Nom
    @GetMapping("/nom/{nomLaboratoire}")
    public ResponseEntity<Laboratoire> findByNomLaboratoire(@PathVariable String nomLaboratoire) {
        return laboratoireService.findByNomLaboratoire(nomLaboratoire)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By Initial
    @GetMapping("/initial/{initial}")
    public ResponseEntity<Laboratoire> findByInitial(@PathVariable String initial) {
        return laboratoireService.findByInitial(initial)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By CED
    @GetMapping("/ced/{cedId}")
    public ResponseEntity<List<Laboratoire>> findByCed(@PathVariable Long cedId) {
        List<Laboratoire> laboratoires = laboratoireService.findByCed(
                Ced.builder().id(cedId).build()
        );
        return ResponseEntity.ok(laboratoires);
    }

    // Read By Directeur
    @GetMapping("/directeur/{directeurId}")
    public ResponseEntity<List<Laboratoire>> findByDirecteur(@PathVariable Long directeurId) {
        List<Laboratoire> laboratoires = laboratoireService.findByDirecteur(
                Professeur.builder().id(directeurId).build()
        );
        return ResponseEntity.ok(laboratoires);
    }

    // Read By Etablissement
    @GetMapping("/etablissement/{etablissementId}")
    public ResponseEntity<List<Laboratoire>> findByEtablissementId(@PathVariable String etablissementId) {
        List<Laboratoire> laboratoires = laboratoireService.findByEtablissementId(etablissementId);
        return ResponseEntity.ok(laboratoires);
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Laboratoire> update(@PathVariable Long id, @RequestBody Laboratoire laboratoire) {
        try {
            Laboratoire updated = laboratoireService.update(id, laboratoire);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            laboratoireService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete All
    @DeleteMapping
    public ResponseEntity<Void> deleteAll() {
        laboratoireService.deleteAll();
        return ResponseEntity.noContent().build();
    }

    // Count
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(laboratoireService.count());
    }
}
