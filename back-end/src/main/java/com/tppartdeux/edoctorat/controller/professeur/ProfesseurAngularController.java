package com.tppartdeux.edoctorat.controller.professeur;

import com.tppartdeux.edoctorat.dto.ResultDTO;
import com.tppartdeux.edoctorat.dto.professeur.*;
import com.tppartdeux.edoctorat.model.auth.User;
import com.tppartdeux.edoctorat.model.professeur.*;
import com.tppartdeux.edoctorat.model.candidat.Postuler;
import com.tppartdeux.edoctorat.security.JwtTokenService;
import com.tppartdeux.edoctorat.service.DtoMapperService;
import com.tppartdeux.edoctorat.service.auth.UserService;
import com.tppartdeux.edoctorat.service.candidat.PostulerService;
import com.tppartdeux.edoctorat.service.professeur.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controller for Professeur-specific Angular endpoints
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:3000", "http://127.0.0.1:4200"})
public class ProfesseurAngularController {

    private final ProfesseurService professeurService;
    private final SujetService sujetService;
    private final FormationDoctoraleService formationDoctoraleService;
    private final CommissionService commissionService;
    private final ExaminerService examinerService;
    private final InscriptionService inscriptionService;
    private final PostulerService postulerService;
    private final UserService userService;
    private final JwtTokenService jwtTokenService;
    private final DtoMapperService dtoMapper;

    // GET /api/get-professeurs/ - Get all professeurs
    @GetMapping("/get-professeurs/")
    public ResponseEntity<ResultDTO<ProfesseurResponse>> getProfesseurs() {
        List<Professeur> professeurs = professeurService.findAll();
        List<ProfesseurResponse> responses = professeurs.stream()
                .map(dtoMapper::toProfesseurResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ResultDTO.of(responses));
    }

    // GET /api/sujets/ - Get sujets for current professeur
    @GetMapping("/sujets/")
    public ResponseEntity<ResultDTO<SujetResponse>> getSujets(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String username = jwtTokenService.getUsernameFromToken(token);
            User user = userService.findByUsername(username).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).build();
            }

            Professeur professeur = professeurService.findByUser(user).orElse(null);
            if (professeur == null) {
                return ResponseEntity.ok(ResultDTO.of(Collections.emptyList()));
            }

            List<Sujet> sujets = sujetService.findByProfesseur(professeur);
            List<SujetResponse> responses = sujets.stream()
                    .map(dtoMapper::toSujetResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(ResultDTO.of(responses));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    // GET /api/sujets/{id}/ - Get sujet by ID
    @GetMapping("/sujets/{id}/")
    public ResponseEntity<SujetResponse> getSujetById(@PathVariable Long id) {
        return sujetService.findById(id)
                .map(sujet -> ResponseEntity.ok(dtoMapper.toSujetResponse(sujet)))
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/sujets/ - Create sujet
    @PostMapping("/sujets/")
    public ResponseEntity<SujetResponse> createSujet(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> body) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String username = jwtTokenService.getUsernameFromToken(token);
            User user = userService.findByUsername(username).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).build();
            }

            Professeur professeur = professeurService.findByUser(user).orElse(null);
            if (professeur == null) {
                return ResponseEntity.status(403).build();
            }

            Sujet sujet = buildSujetFromMap(body, professeur);
            Sujet created = sujetService.create(sujet);
            return new ResponseEntity<>(dtoMapper.toSujetResponse(created), HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(400).build();
        }
    }

    // PUT /api/sujets/{id}/ - Update sujet
    @PutMapping("/sujets/{id}/")
    public ResponseEntity<SujetResponse> updateSujet(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        try {
            Sujet existing = sujetService.findById(id).orElse(null);
            if (existing == null) {
                return ResponseEntity.notFound().build();
            }

            updateSujetFromMap(existing, body);
            Sujet updated = sujetService.update(id, existing);
            return ResponseEntity.ok(dtoMapper.toSujetResponse(updated));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /api/sujets/{id}/ - Delete sujet
    @DeleteMapping("/sujets/{id}/")
    public ResponseEntity<Void> deleteSujet(@PathVariable Long id) {
        try {
            sujetService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    private Sujet buildSujetFromMap(Map<String, Object> body, Professeur professeur) {
        Sujet sujet = new Sujet();
        sujet.setProfesseur(professeur);
        sujet.setTitre((String) body.get("titre"));
        sujet.setDescription((String) body.get("description"));
        sujet.setPublier(body.get("publier") != null ? (Boolean) body.get("publier") : false);

        if (body.get("formationDoctorale") != null) {
            Long fdId = Long.valueOf(body.get("formationDoctorale").toString());
            formationDoctoraleService.findById(fdId).ifPresent(sujet::setFormationDoctorale);
        }

        if (body.get("coDirecteur") != null) {
            Long coDirecteurId = Long.valueOf(body.get("coDirecteur").toString());
            professeurService.findById(coDirecteurId).ifPresent(sujet::setCoDirecteur);
        }

        return sujet;
    }

    private void updateSujetFromMap(Sujet sujet, Map<String, Object> body) {
        if (body.containsKey("titre")) sujet.setTitre((String) body.get("titre"));
        if (body.containsKey("description")) sujet.setDescription((String) body.get("description"));
        if (body.containsKey("publier")) sujet.setPublier((Boolean) body.get("publier"));

        if (body.get("formationDoctorale") != null) {
            Long fdId = Long.valueOf(body.get("formationDoctorale").toString());
            formationDoctoraleService.findById(fdId).ifPresent(sujet::setFormationDoctorale);
        }

        if (body.get("coDirecteur") != null) {
            Long coDirecteurId = Long.valueOf(body.get("coDirecteur").toString());
            professeurService.findById(coDirecteurId).ifPresent(sujet::setCoDirecteur);
        }
    }

    // GET /api/participant/ - Get commissions for current professeur
    @GetMapping("/participant/")
    public ResponseEntity<ResultDTO<CommissionResponse>> getParticipantCommissions(
            @RequestHeader("Authorization") String authHeader) {
        try {
            // For now, return all commissions - in production, filter by participant
            List<Commission> commissions = commissionService.findAll();
            List<CommissionResponse> responses = commissions.stream()
                    .map(c -> dtoMapper.toCommissionResponse(c, Collections.emptyList(), Collections.emptyList()))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(ResultDTO.of(responses));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    // GET /api/examiner/ - Get examiner results for current professeur
    @GetMapping("/examiner/")
    public ResponseEntity<ResultDTO<ExaminerResponse>> getExaminerResults(
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer offset,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String username = jwtTokenService.getUsernameFromToken(token);
            User user = userService.findByUsername(username).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).build();
            }

            Professeur professeur = professeurService.findByUser(user).orElse(null);
            if (professeur == null) {
                return ResponseEntity.ok(ResultDTO.of(Collections.emptyList()));
            }

            // Get sujets for this professeur and then examiners for those sujets
            List<Sujet> sujets = sujetService.findByProfesseur(professeur);
            List<Examiner> allExaminers = sujets.stream()
                    .flatMap(s -> examinerService.findBySujet(s).stream())
                    .collect(Collectors.toList());

            // Apply pagination
            int start = offset != null ? offset : 0;
            int end = limit != null ? Math.min(start + limit, allExaminers.size()) : allExaminers.size();

            List<ExaminerResponse> responses = allExaminers.subList(start, end).stream()
                    .map(dtoMapper::toExaminerResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(ResultDTO.of(responses, allExaminers.size(), null, null));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    // GET /api/inscrits/ - Get inscriptions for current professeur's sujets
    @GetMapping("/inscrits/")
    public ResponseEntity<ResultDTO<InscriptionResponse>> getInscrits(
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer offset,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String username = jwtTokenService.getUsernameFromToken(token);
            User user = userService.findByUsername(username).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).build();
            }

            Professeur professeur = professeurService.findByUser(user).orElse(null);
            if (professeur == null) {
                return ResponseEntity.ok(ResultDTO.of(Collections.emptyList()));
            }

            List<Sujet> sujets = sujetService.findByProfesseur(professeur);
            List<Inscription> allInscriptions = sujets.stream()
                    .flatMap(s -> inscriptionService.findBySujet(s).stream())
                    .collect(Collectors.toList());

            // Apply pagination
            int start = offset != null ? offset : 0;
            int end = limit != null ? Math.min(start + limit, allInscriptions.size()) : allInscriptions.size();

            List<InscriptionResponse> responses = allInscriptions.subList(start, end).stream()
                    .map(dtoMapper::toInscriptionResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(ResultDTO.of(responses, allInscriptions.size(), null, null));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    // GET /api/get-professeur-candidats/ - Get candidats who applied to professeur's sujets
    @GetMapping("/get-professeur-candidats/")
    public ResponseEntity<ResultDTO<PostulerResponse>> getProfesseurCandidats(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String username = jwtTokenService.getUsernameFromToken(token);
            User user = userService.findByUsername(username).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).build();
            }

            Professeur professeur = professeurService.findByUser(user).orElse(null);
            if (professeur == null) {
                return ResponseEntity.ok(ResultDTO.of(Collections.emptyList()));
            }

            List<Sujet> sujets = sujetService.findByProfesseur(professeur);
            List<Postuler> allPostulers = sujets.stream()
                    .flatMap(s -> postulerService.findBySujet(s).stream())
                    .collect(Collectors.toList());

            List<PostulerResponse> responses = allPostulers.stream()
                    .map(dtoMapper::toPostulerResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(ResultDTO.of(responses));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }
}
