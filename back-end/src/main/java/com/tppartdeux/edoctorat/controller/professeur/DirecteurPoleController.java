package com.tppartdeux.edoctorat.controller.professeur;

import com.tppartdeux.edoctorat.dto.ResultDTO;
import com.tppartdeux.edoctorat.dto.professeur.*;
import com.tppartdeux.edoctorat.model.candidat.Postuler;
import com.tppartdeux.edoctorat.model.professeur.*;
import com.tppartdeux.edoctorat.service.DtoMapperService;
import com.tppartdeux.edoctorat.service.candidat.PostulerService;
import com.tppartdeux.edoctorat.service.professeur.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


/**
 * Controller for Directeur Pole specific Angular endpoints
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DirecteurPoleController {

    private final SujetService sujetService;
    private final CommissionService commissionService;
    private final InscriptionService inscriptionService;
    private final PostulerService postulerService;
    private final ExaminerService examinerService;
    private final DtoMapperService dtoMapper;
    private final DirecteurPoleCalendrierService directeurPoleCalendrierService;

    // GET /api/get-all-candidats/ - Get all candidats (postulations)
    @GetMapping("/get-all-candidats/")
    public ResponseEntity<ResultDTO<PostulerResponse>> getAllCandidats(
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer offset) {
        List<Postuler> postulations = postulerService.findAll();
        
        int start = offset != null ? offset : 0;
        int end = limit != null ? Math.min(start + limit, postulations.size()) : postulations.size();
        
        List<PostulerResponse> responses = postulations.subList(start, end).stream()
                .map(dtoMapper::toPostulerResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ResultDTO.of(responses, postulations.size(), null, null));
    }

    // GET /api/get-all-sujets/ - Get all sujets
    @GetMapping("/get-all-sujets/")
    public ResponseEntity<ResultDTO<SujetResponse>> getAllSujets(
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer offset) {
        List<Sujet> sujets = sujetService.findAll();
        
        int start = offset != null ? offset : 0;
        int end = limit != null ? Math.min(start + limit, sujets.size()) : sujets.size();
        
        List<SujetResponse> responses = sujets.subList(start, end).stream()
                .map(dtoMapper::toSujetResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ResultDTO.of(responses, sujets.size(), null, null));
    }

    // GET /api/get-all-commissions/ - Get all commissions
    @GetMapping("/get-all-commissions/")
    public ResponseEntity<ResultDTO<CommissionResponse>> getAllCommissions(
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer offset) {
        List<Commission> commissions = commissionService.findAll();
        
        int start = offset != null ? offset : 0;
        int end = limit != null ? Math.min(start + limit, commissions.size()) : commissions.size();
        
        List<CommissionResponse> responses = commissions.subList(start, end).stream()
                .map(c -> dtoMapper.toCommissionResponse(c, Collections.emptyList(), Collections.emptyList()))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ResultDTO.of(responses, commissions.size(), null, null));
    }

    // GET /api/get-all-inscriptions/ - Get all inscriptions
    @GetMapping("/get-all-inscriptions/")
    public ResponseEntity<ResultDTO<InscriptionResponse>> getAllInscriptions(
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer offset) {
        List<Inscription> inscriptions = inscriptionService.findAll();
        
        int start = offset != null ? offset : 0;
        int end = limit != null ? Math.min(start + limit, inscriptions.size()) : inscriptions.size();
        
        List<InscriptionResponse> responses = inscriptions.subList(start, end).stream()
                .map(dtoMapper::toInscriptionResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ResultDTO.of(responses, inscriptions.size(), null, null));
    }

    // PATCH /api/publier-sujets/ - Publish all sujets
    @PatchMapping("/publier-sujets/")
    public ResponseEntity<?> publierSujets() {
        try {
            List<Sujet> sujets = sujetService.findAll();
            for (Sujet sujet : sujets) {
                sujet.setPublier(true);
                sujetService.update(sujet.getId(), sujet);
            }
            return ResponseEntity.ok(Map.of("message", "Sujets published successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(400).build();
        }
    }

    // POST /api/publier-liste-attente/ - Publish waiting list
    @PostMapping("/publier-liste-attente/")
    public ResponseEntity<?> publierListeAttente() {
        try {
            // Set examiners on waiting list to published
            List<Examiner> examiners = examinerService.findByPublier(false);
            for (Examiner examiner : examiners) {
                if ("attente".equalsIgnoreCase(examiner.getDecision())) {
                    examiner.setPublier(true);
                    examinerService.update(examiner.getId(), examiner);
                }
            }
            return ResponseEntity.ok(Map.of("message", "Waiting list published successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(400).build();
        }
    }

    // POST /api/publier-liste-principale/ - Publish main list
    @PostMapping("/publier-liste-principale/")
    public ResponseEntity<?> publierListePrincipale() {
        try {
            // Set examiners on main list to published
            List<Examiner> examiners = examinerService.findByPublier(false);
            for (Examiner examiner : examiners) {
                if ("accepte".equalsIgnoreCase(examiner.getDecision())) {
                    examiner.setPublier(true);
                    examinerService.update(examiner.getId(), examiner);
                }
            }
            return ResponseEntity.ok(Map.of("message", "Main list published successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(400).build();
        }
    }

    @GetMapping("professeur/calendrier")
    public ResponseEntity<List<DirecteurPoleCalendrier>> getMethodName() {
        try {
            List<DirecteurPoleCalendrier> calendrierResponses = directeurPoleCalendrierService.findAll();
            
            return ResponseEntity.ok(calendrierResponses);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    
}
