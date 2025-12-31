package com.tppartdeux.edoctorat.controller.professeur;

import com.tppartdeux.edoctorat.model.professeur.DirecteurPoleCalendrier;
import com.tppartdeux.edoctorat.service.professeur.DirecteurPoleCalendrierService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/professeur/calendrier")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DirecteurPoleCalendrierController {

    @Autowired
    private final DirecteurPoleCalendrierService directeurPoleCalendrierService;

    // Create
    @PostMapping
    public ResponseEntity<DirecteurPoleCalendrier> create(@RequestBody DirecteurPoleCalendrier calendrier) {
        DirecteurPoleCalendrier created = directeurPoleCalendrierService.create(calendrier);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Read All
    @GetMapping
    public ResponseEntity<List<DirecteurPoleCalendrier>> findAll() {
        List<DirecteurPoleCalendrier> calendriers = directeurPoleCalendrierService.findAll();
        return ResponseEntity.ok(calendriers);
    }

    // Read By ID
    @GetMapping("/{id}")
    public ResponseEntity<DirecteurPoleCalendrier> findById(@PathVariable Integer id) {
        return directeurPoleCalendrierService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By Pour
    @GetMapping("/pour/{pour}")
    public ResponseEntity<List<DirecteurPoleCalendrier>> findByPour(@PathVariable String pour) {
        List<DirecteurPoleCalendrier> calendriers = directeurPoleCalendrierService.findByPour(pour);
        return ResponseEntity.ok(calendriers);
    }

    // Read By Date Debut Range
    @GetMapping("/date-debut-range")
    public ResponseEntity<List<DirecteurPoleCalendrier>> findByDateDebutBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<DirecteurPoleCalendrier> calendriers = directeurPoleCalendrierService.findByDateDebutBetween(startDate, endDate);
        return ResponseEntity.ok(calendriers);
    }

    // Read By Date Fin Range
    @GetMapping("/date-fin-range")
    public ResponseEntity<List<DirecteurPoleCalendrier>> findByDateFinBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<DirecteurPoleCalendrier> calendriers = directeurPoleCalendrierService.findByDateFinBetween(startDate, endDate);
        return ResponseEntity.ok(calendriers);
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<DirecteurPoleCalendrier> update(@PathVariable Integer id, @RequestBody DirecteurPoleCalendrier calendrier) {
        try {
            DirecteurPoleCalendrier updated = directeurPoleCalendrierService.update(id, calendrier);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        try {
            directeurPoleCalendrierService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete All
    @DeleteMapping
    public ResponseEntity<Void> deleteAll() {
        directeurPoleCalendrierService.deleteAll();
        return ResponseEntity.noContent().build();
    }

    // Count
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(directeurPoleCalendrierService.count());
    }
}
