package com.tppartdeux.edoctorat.controller.professeur;

import com.tppartdeux.edoctorat.dto.ResultDTO;
import com.tppartdeux.edoctorat.dto.auth.UserInfoResponse;
import com.tppartdeux.edoctorat.dto.professeur.*;

import com.tppartdeux.edoctorat.model.auth.User;
import com.tppartdeux.edoctorat.model.professeur.*;
import com.tppartdeux.edoctorat.repository.auth.UserRepository;
import com.tppartdeux.edoctorat.repository.professeur.CommissionProfesseurRepository;
import com.tppartdeux.edoctorat.repository.professeur.ProfesseurRepository;
import com.tppartdeux.edoctorat.service.DtoMapperService;
import com.tppartdeux.edoctorat.security.JwtTokenService;
import com.tppartdeux.edoctorat.service.auth.UserService;
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
    private final FormationDoctoraleService formationDoctoraleService;
    private final CommissionProfesseurRepository commissionProfesseurRepository;
    private final JwtTokenService jwtTokenService;
    private final UserService userService;

    // GET /api/directeur-labo-info/ - Get current directeur labo information including laboratory
    @GetMapping("/directeur-labo-info/")
    public ResponseEntity<?> getDirecteurLaboInfo(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String username = jwtTokenService.getUsernameFromToken(token);
            User user = userService.findByUsername(username).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of(
                    "error", "Unauthorized",
                    "message", "Invalid authentication token"
                ));
            }

            Professeur professeur = professeurService.findByUser(user).orElse(null);
            if (professeur == null) {
                return ResponseEntity.status(404).body(Map.of(
                    "error", "Not Found",
                    "message", "Professeur profile not found for this user"
                ));
            }

            DirecteurLaboResponse response = dtoMapper.toDirecteurLaboResponse(professeur);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "error", "Internal Server Error",
                "message", "Error retrieving directeur labo information: " + e.getMessage()
            ));
        }
    }

    // GET /api/my-laboratory-id/ - Get laboratory ID of current directeur
    @GetMapping("/my-laboratory-id/")
    public ResponseEntity<?> getMyLaboratoryId(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String username = jwtTokenService.getUsernameFromToken(token);
            User user = userService.findByUsername(username).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of(
                    "error", "Unauthorized",
                    "message", "Invalid authentication token"
                ));
            }

            Professeur professeur = professeurService.findByUser(user).orElse(null);
            if (professeur == null) {
                return ResponseEntity.status(404).body(Map.of(
                    "error", "Not Found",
                    "message", "Professeur profile not found for this user"
                ));
            }

            // If professeur has a direct laboratory association, use it
            if (professeur.getLabo() != null) {
                return ResponseEntity.ok(Map.of(
                    "laboratoireId", professeur.getLabo().getId(),
                    "laboratoireNom", professeur.getLabo().getNomLaboratoire()
                ));
            }

            // Otherwise, try to find laboratory from professeur's subjects
            List<Sujet> sujets = sujetService.findByProfesseur(professeur);
            if (!sujets.isEmpty() && sujets.get(0).getFormationDoctorale() != null) {
                // The formation doctorale might have laboratory info
                return ResponseEntity.ok(Map.of(
                    "laboratoireId", sujets.get(0).getFormationDoctorale().getId(),
                    "message", "Laboratory ID derived from subjects"
                ));
            }

            return ResponseEntity.status(404).body(Map.of(
                "error", "Not Found",
                "message", "No laboratory found for this directeur"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "error", "Internal Server Error",
                "message", "Error retrieving laboratory information: " + e.getMessage()
            ));
        }
    }

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

    // POST /api/commission-with-details/ - Create commission with full details
    @PostMapping("/commission-with-details/")
    public ResponseEntity<?> createCommissionWithDetails(@RequestBody Map<String, Object> body) {
        try {
            // Validate required fields
            if (!body.containsKey("dateCommission") || !body.containsKey("heure") || 
                !body.containsKey("lieu") || !body.containsKey("labo")) {
                return ResponseEntity.status(400).body(Map.of(
                    "error", "Missing required fields",
                    "message", "dateCommission, heure, lieu, and labo are required"
                ));
            }

            // Create the commission first
            Commission commission = new Commission();
            commission.setDateCommission(LocalDate.parse(body.get("dateCommission").toString()));
            commission.setHeure(LocalTime.parse(body.get("heure").toString()));
            commission.setLieu((String) body.get("lieu"));
            
            // Validate and set laboratory
            Long laboId = Long.valueOf(body.get("labo").toString());
            Laboratoire labo = laboratoireService.findById(laboId).orElse(null);
            if (labo == null) {
                return ResponseEntity.status(400).body(Map.of(
                    "error", "Invalid laboratory ID",
                    "message", "Laboratoire avec l'ID " + laboId + " n'existe pas. Veuillez vérifier votre configuration."
                ));
            }
            commission.setLabo(labo);

            Commission createdCommission = commissionService.create(commission);

            // Add participants (professors) to the commission
            if (body.containsKey("participantIds")) {
                @SuppressWarnings("unchecked")
                List<Integer> participantIds = (List<Integer>) body.get("participantIds");
                for (Integer profId : participantIds) {
                    professeurService.findById(profId.longValue()).ifPresent(prof -> {
                        CommissionProfesseurs cp = CommissionProfesseurs.builder()
                                .commission(createdCommission)
                                .professeur(prof)
                                .build();
                        commissionProfesseurRepository.save(cp);
                    });
                }
            }

            // Create examiners for selected candidates and subjects
            if (body.containsKey("sujetIds") && body.containsKey("candidatCnes")) {
                @SuppressWarnings("unchecked")
                List<Integer> sujetIds = (List<Integer>) body.get("sujetIds");
                @SuppressWarnings("unchecked")
                List<String> candidatCnes = (List<String>) body.get("candidatCnes");

                for (String cne : candidatCnes) {
                    // Find the candidate's postuler record to get the associated sujet
                    postulerService.findByCandidatCne(cne).ifPresent(postuler -> {
                        if (sujetIds.contains(postuler.getSujet().getId().intValue())) {
                            // Create examiner entry for this candidate
                            Examiner examiner = Examiner.builder()
                                    .commission(createdCommission)
                                    .sujet(postuler.getSujet())
                                    .candidat(postuler.getCandidat())
                                    .noteDossier(0.0f)
                                    .noteEntretien(0)
                                    .decision("")
                                    .publier(false)
                                    .valider(false)
                                    .build();
                            examinerService.create(examiner);
                        }
                    });
                }
            }

            // Get participants and sujets for response
            List<Professeur> participants = commissionProfesseurRepository.findByCommission(createdCommission)
                    .stream()
                    .map(CommissionProfesseurs::getProfesseur)
                    .collect(Collectors.toList());

            List<Sujet> sujets = examinerService.findByCommission(createdCommission)
                    .stream()
                    .map(Examiner::getSujet)
                    .distinct()
                    .collect(Collectors.toList());

            return new ResponseEntity<>(
                    dtoMapper.toCommissionResponse(createdCommission, participants, sujets),
                    HttpStatus.CREATED);
        } catch (java.time.format.DateTimeParseException e) {
            return ResponseEntity.status(400).body(Map.of(
                "error", "Invalid date or time format",
                "message", "Format de date ou d'heure invalide. Utilisez le format correct (YYYY-MM-DD pour la date, HH:mm pour l'heure)"
            ));
        } catch (NumberFormatException e) {
            return ResponseEntity.status(400).body(Map.of(
                "error", "Invalid number format",
                "message", "L'ID du laboratoire doit être un nombre valide"
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(400).body(Map.of(
                "error", "Commission creation failed",
                "message", "Erreur lors de la création de la commission: " + e.getMessage()
            ));
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

    // GET /api/getAllFormations/ - Get all formations sous form table
    @GetMapping("/formations/")
    public ResponseEntity<ResultDTO<FormationDoctoraleResponse>> getAllFormations(
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer offset) {
        try {
            List<FormationDoctorale> formations = formationDoctoraleService.findAll();
    
            int start = offset != null ? offset : 0;
            int end = limit != null ? Math.min(start + limit, formations.size()) : formations.size();
    
            List<FormationDoctoraleResponse> responses = formations.subList(start, end).stream()
                    .map(dtoMapper::toFormationDoctoraleResponse)
                    .collect(Collectors.toList());
    
            return ResponseEntity.ok(ResultDTO.of(responses, formations.size(), null, null));
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
