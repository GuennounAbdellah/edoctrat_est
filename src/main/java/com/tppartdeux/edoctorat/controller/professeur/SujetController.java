package com.tppartdeux.edoctorat.controller.professeur;

import com.tppartdeux.edoctorat.dto.ResultDTO;
import com.tppartdeux.edoctorat.dto.professeur.SujetResponse;
import com.tppartdeux.edoctorat.model.professeur.Sujet;
import com.tppartdeux.edoctorat.model.professeur.Professeur;
import com.tppartdeux.edoctorat.model.professeur.FormationDoctorale;
import com.tppartdeux.edoctorat.service.DtoMapperService;
import com.tppartdeux.edoctorat.service.professeur.SujetService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SujetController {

    @Autowired
    private final SujetService sujetService;
    
    @Autowired
    private final DtoMapperService dtoMapper;

    // GET /api/get-all-sujets - Returns Result wrapper for Angular
    @GetMapping("/get-all-sujets")
    public ResponseEntity<ResultDTO<SujetResponse>> getAllSujets() {
        List<Sujet> sujets = sujetService.findAll();
        List<SujetResponse> responses = sujets.stream()
                .map(dtoMapper::toSujetResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ResultDTO.of(responses));
    }

    @GetMapping("/get-sujet-by-id/{id}")
    public ResponseEntity<Sujet> getSujetById(@PathVariable Long id) {
        return sujetService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create
    @PostMapping("/professeur/sujets")
    public ResponseEntity<Sujet> create(@RequestBody Sujet sujet) {
        Sujet created = sujetService.create(sujet);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Read All
    @GetMapping("/professeur/sujets")
    public ResponseEntity<List<Sujet>> findAll() {
        List<Sujet> sujets = sujetService.findAll();
        return ResponseEntity.ok(sujets);
    }

    // Read By ID
    @GetMapping("/professeur/sujets/{id}")
    public ResponseEntity<Sujet> findById(@PathVariable Long id) {
        return sujetService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By Professeur
    @GetMapping("/professeur/sujets/professeur/{professeurId}")
    public ResponseEntity<List<Sujet>> findByProfesseur(@PathVariable Long professeurId) {
        List<Sujet> sujets = sujetService.findByProfesseur(
                Professeur.builder().id(professeurId).build()
        );
        return ResponseEntity.ok(sujets);
    }

    // Read By Formation Doctorale
    @GetMapping("/professeur/sujets/formation/{formationId}")
    public ResponseEntity<List<Sujet>> findByFormationDoctorale(@PathVariable Long formationId) {
        List<Sujet> sujets = sujetService.findByFormationDoctorale(
                FormationDoctorale.builder().id(formationId).build()
        );
        return ResponseEntity.ok(sujets);
    }

    // Read By Publier
    @GetMapping("/professeur/sujets/publier/{publier}")
    public ResponseEntity<List<Sujet>> findByPublier(@PathVariable Boolean publier) {
        List<Sujet> sujets = sujetService.findByPublier(publier);
        return ResponseEntity.ok(sujets);
    }

    // Read By Co-Directeur
    @GetMapping("/professeur/sujets/codirecteur/{coDirecteurId}")
    public ResponseEntity<List<Sujet>> findByCoDirecteur(@PathVariable Long coDirecteurId) {
        List<Sujet> sujets = sujetService.findByCoDirecteur(
                Professeur.builder().id(coDirecteurId).build()
        );
        return ResponseEntity.ok(sujets);
    }

    // Update
    @PutMapping("/professeur/sujets/{id}")
    public ResponseEntity<Sujet> update(@PathVariable Long id, @RequestBody Sujet sujet) {
        try {
            Sujet updated = sujetService.update(id, sujet);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete
    @DeleteMapping("/professeur/sujets/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            sujetService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete All
    @DeleteMapping("/professeur/sujets")
    public ResponseEntity<Void> deleteAll() {
        sujetService.deleteAll();
        return ResponseEntity.noContent().build();
    }

    // Count
    @GetMapping("/professeur/sujets/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(sujetService.count());
    }
}
