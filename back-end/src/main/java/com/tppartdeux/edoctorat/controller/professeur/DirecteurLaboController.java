package com.tppartdeux.edoctorat.controller.professeur;

import com.tppartdeux.edoctorat.dto.ResultDTO;
import com.tppartdeux.edoctorat.dto.professeur.*;

import com.tppartdeux.edoctorat.model.professeur.*;
import com.tppartdeux.edoctorat.service.DtoMapperService;
import com.tppartdeux.edoctorat.service.candidat.PostulerService;
import com.tppartdeux.edoctorat.service.professeur.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controller for Directeur Labo specific Angular endpoints
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:8081", "http://localhost:3000" })
public class DirecteurLaboController {

    private final SujetService sujetService;
    private final CommissionService commissionService;
    private final ProfesseurService professeurService;
    private final LaboratoireService laboratoireService;
    private final ExaminerService examinerService;
    private final DtoMapperService dtoMapper;
    private final PostulerService postulerService;

    @GetMapping("/labo-candidats-joined/")
    public ResponseEntity<List<PostulerJoinedResponse>> getCandidatsJoined(
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer offset) {
        try {
            List<PostulerJoinedResponse> candidatsJoined = postulerService.getCandidatsJoinedData();

            int start = offset != null ? offset : 0;
            int end = limit != null ? Math.min(start + limit, candidatsJoined.size()) : candidatsJoined.size();

            List<PostulerJoinedResponse> responses = candidatsJoined.subList(start, end);
            System.out.println("Responses: " + responses);
            return ResponseEntity.ok(responses); // <-- tableau direct
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    // GET /api/sujetslabo/ - Get sujets for labo
    @GetMapping("/sujetslabo/")
    public ResponseEntity<ResultDTO<SujetResponse>> getSujetsLabo(
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer offset) {
        try {
            // For now return all sujets - in production filter by labo
            List<Sujet> sujets = sujetService.findAll();

            int start = offset != null ? offset : 0;
            int end = limit != null ? Math.min(start + limit, sujets.size()) : sujets.size();

            List<SujetResponse> responses = sujets.subList(start, end).stream()
                    .map(dtoMapper::toSujetResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(ResultDTO.of(responses, sujets.size(), null, null));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    // POST /api/sujetslabo/ - Create sujet for labo
    @PostMapping("/sujetslabo/")
    public ResponseEntity<SujetResponse> createSujetLabo(
            @RequestBody Sujet sujet) {
        try {
            Sujet created = sujetService.create(sujet);
            return new ResponseEntity<>(dtoMapper.toSujetResponse(created), HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(400).build();
        }
    }
    
    // GET /api/sujetslabo/{id}/ - Get sujet for labo
    @GetMapping("/sujetslabo/{id}/")
    public ResponseEntity<SujetResponse> getSujetLabo(@PathVariable Long id) {
        try {
            Sujet sujet = sujetService.findById(id).orElse(null);
            if (sujet == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(dtoMapper.toSujetResponse(sujet));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }
    // PUT /api/sujetslabo/{id}/ - Update sujet for labo
    @PutMapping("/sujetslabo/{id}/")
    public ResponseEntity<SujetResponse> updateSujetLabo(
            @PathVariable Long id,
            @RequestBody Sujet sujetData) {
        try {
            Sujet updated = sujetService.update(id, sujetData);
            return ResponseEntity.ok(dtoMapper.toSujetResponse(updated));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /api/sujetslabo/{id}/ - Delete sujet for labo
    @DeleteMapping("/sujetslabo/{id}/")
    public ResponseEntity<Void> deleteSujetLabo(@PathVariable Long id) {
        try {
            sujetService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // GET /api/commission/ - Get commissions for labo
    @GetMapping("/commission/")
    public ResponseEntity<ResultDTO<CommissionResponse>> getCommissions(
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

    // POST /api/commission/ - Create commission
    @PostMapping("/commission/")
    public ResponseEntity<CommissionResponse> createCommission(@RequestBody Map<String, Object> body) {
        try {
            Commission commission = new Commission();
            if (body.containsKey("dateCommission")) {
                commission.setDateCommission(LocalDate.parse(body.get("dateCommission").toString()));
            }
            if (body.containsKey("heure")) {
                commission.setHeure(LocalTime.parse(body.get("heure").toString()));
            }
            if (body.containsKey("lieu")) {
                commission.setLieu((String) body.get("lieu"));
            }
            if (body.containsKey("labo")) {
                Long laboId = Long.valueOf(body.get("labo").toString());
                laboratoireService.findById(laboId).ifPresent(commission::setLabo);
            }

            Commission created = commissionService.create(commission);
            return new ResponseEntity<>(
                    dtoMapper.toCommissionResponse(created, Collections.emptyList(), Collections.emptyList()),
                    HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(400).build();
        }
    }

    // PUT /api/commission/{id}/ - Update commission
    @PutMapping("/commission/{id}/")
    public ResponseEntity<CommissionResponse> updateCommission(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        try {
            Commission existing = commissionService.findById(id).orElse(null);
            if (existing == null) {
                return ResponseEntity.notFound().build();
            }

            if (body.containsKey("dateCommission")) {
                existing.setDateCommission(LocalDate.parse(body.get("dateCommission").toString()));
            }
            if (body.containsKey("heure")) {
                existing.setHeure(LocalTime.parse(body.get("heure").toString()));
            }
            if (body.containsKey("lieu")) {
                existing.setLieu((String) body.get("lieu"));
            }

            Commission updated = commissionService.update(id, existing);
            return ResponseEntity
                    .ok(dtoMapper.toCommissionResponse(updated, Collections.emptyList(), Collections.emptyList()));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /api/commission/{id}/ - Delete commission
    @DeleteMapping("/commission/{id}/")
    public ResponseEntity<Void> deleteCommission(@PathVariable Long id) {
        try {
            commissionService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // GET /api/labo_professeur/ - Get professeurs in labo
    @GetMapping("/labo_professeur/")
    public ResponseEntity<ResultDTO<ProfesseurResponse>> getLaboProfesseurs(
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer offset) {
        List<Professeur> professeurs = professeurService.findAll();

        int start = offset != null ? offset : 0;
        int end = limit != null ? Math.min(start + limit, professeurs.size()) : professeurs.size();

        List<ProfesseurResponse> responses = professeurs.subList(start, end).stream()
                .map(dtoMapper::toProfesseurResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ResultDTO.of(responses, professeurs.size(), null, null));
    }

    // GET /api/labo_candidat/ - Get candidats in labo examiners
    @GetMapping("/labo_candidat/")
    public ResponseEntity<ResultDTO<ExaminerResponse>> getLaboCandidats(
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer offset) {
        List<Examiner> examiners = examinerService.findAll();

        int start = offset != null ? offset : 0;
        int end = limit != null ? Math.min(start + limit, examiners.size()) : examiners.size();

        List<ExaminerResponse> responses = examiners.subList(start, end).stream()
                .map(dtoMapper::toExaminerResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ResultDTO.of(responses, examiners.size(), null, null));
    }

    // GET /api/get-sujet-candidat/{id}/ - Get candidats for a sujet
    @GetMapping("/get-sujet-candidat/{id}/")
    public ResponseEntity<ResultDTO<ExaminerResponse>> getSujetCandidats(@PathVariable Long id) {
        Sujet sujet = sujetService.findById(id).orElse(null);
        if (sujet == null) {
            return ResponseEntity.notFound().build();
        }

        List<Examiner> examiners = examinerService.findBySujet(sujet);
        List<ExaminerResponse> responses = examiners.stream()
                .map(dtoMapper::toExaminerResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ResultDTO.of(responses));
    }

    // PUT /api/labo_valider_examiner/{id}/ - Validate examiner
    @PutMapping("/labo_valider_examiner/{id}/")
    public ResponseEntity<ExaminerResponse> validerExaminer(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        try {
            Examiner examiner = examinerService.findById(id).orElse(null);
            if (examiner == null) {
                return ResponseEntity.notFound().build();
            }

            if (body.containsKey("valider")) {
                examiner.setValider((Boolean) body.get("valider"));
            }
            if (body.containsKey("decision")) {
                examiner.setDecision((String) body.get("decision"));
            }

            Examiner updated = examinerService.update(id, examiner);
            return ResponseEntity.ok(dtoMapper.toExaminerResponse(updated));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // POST /api/convoque-candidat/{id}/ - Send convocation to candidat
    @PostMapping("/convoque-candidat/{id}/")
    public ResponseEntity<?> convoqueCandidat(@PathVariable Long id) {
        try {
            Examiner examiner = examinerService.findById(id).orElse(null);
            if (examiner == null) {
                return ResponseEntity.notFound().build();
            }
            // In production, send notification to candidat
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(400).build();
        }
    }
}
