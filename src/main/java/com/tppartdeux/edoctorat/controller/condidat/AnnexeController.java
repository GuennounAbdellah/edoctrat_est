package com.tppartdeux.edoctorat.controller.condidat;

import com.tppartdeux.edoctorat.model.candidat.Annexe;
import com.tppartdeux.edoctorat.service.candidat.AnnexeService;
import com.tppartdeux.edoctorat.service.candidat.DiplomeService;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidat/annexes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnnexeController {

    @Autowired
    private final AnnexeService annexeService;
    @Autowired
    private final DiplomeService diplomeService;

    //CRUD Functions
    // Create
    @PostMapping
    public ResponseEntity<Annexe> create(@RequestBody Annexe annexe) {
        Annexe created = annexeService.create(annexe);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Read All
    @GetMapping
    public ResponseEntity<List<Annexe>> findAll() {
        List<Annexe> annexes = annexeService.findAll();
        return ResponseEntity.ok(annexes);
    }

    // Read By ID
    @GetMapping("/{id}")
    public ResponseEntity<Annexe> findById(@PathVariable Long id) {
        return annexeService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By Diplome
    @GetMapping("/diplome/{diplomeId}")
    public ResponseEntity<List<Annexe>> findByDiplome(@PathVariable Long diplomeId) {
        return diplomeService.findById(diplomeId)
                .map(diplome -> ResponseEntity.ok(annexeService.findByDiplome(diplome)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By Type Annexe
    @GetMapping("/type/{typeAnnexe}")
    public ResponseEntity<List<Annexe>> findByTypeAnnexe(@PathVariable String typeAnnexe) {
        List<Annexe> annexes = annexeService.findByTypeAnnexe(typeAnnexe);
        return ResponseEntity.ok(annexes);
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Annexe> update(@PathVariable Long id, @RequestBody Annexe annexe) {
        try {
            Annexe updated = annexeService.update(id, annexe);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            annexeService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete All
    @DeleteMapping
    public ResponseEntity<Void> deleteAll() {
        annexeService.deleteAll();
        return ResponseEntity.noContent().build();
    }

    // Count
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(annexeService.count());
    }
}
