package com.tppartdeux.edoctorat.controller.condidat;

import com.tppartdeux.edoctorat.dto.ConfigResponse;
import com.tppartdeux.edoctorat.dto.ResultDTO;
import com.tppartdeux.edoctorat.dto.candidat.CandidatResponse;
import com.tppartdeux.edoctorat.dto.candidat.DiplomeResponse;
import com.tppartdeux.edoctorat.dto.professeur.PostulerResponse;
import com.tppartdeux.edoctorat.dto.professeur.SujetResponse;
import com.tppartdeux.edoctorat.model.candidat.Candidat;
import com.tppartdeux.edoctorat.model.candidat.Diplome;
import com.tppartdeux.edoctorat.model.candidat.Pays;
import com.tppartdeux.edoctorat.model.candidat.Postuler;
import com.tppartdeux.edoctorat.model.professeur.Sujet;
import com.tppartdeux.edoctorat.repository.candidat.PaysRepository;
import com.tppartdeux.edoctorat.security.JwtTokenService;
import com.tppartdeux.edoctorat.service.DtoMapperService;
import com.tppartdeux.edoctorat.service.candidat.CandidatService;
import com.tppartdeux.edoctorat.service.candidat.DiplomeService;
import com.tppartdeux.edoctorat.service.candidat.PostulerService;
import com.tppartdeux.edoctorat.service.professeur.SujetService;
import com.tppartdeux.edoctorat.service.auth.UserService;
import com.tppartdeux.edoctorat.model.auth.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controller for Candidat-specific Angular endpoints
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CandidatController {

    private final CandidatService candidatService;
    private final DiplomeService diplomeService;
    private final PostulerService postulerService;
    private final SujetService sujetService;
    private final UserService userService;
    private final JwtTokenService jwtTokenService;
    private final DtoMapperService dtoMapper;
    private final PaysRepository paysRepository;

    // GET /api/candidat-info/ - Get current candidat info
    @GetMapping("/candidat-info/")
    public ResponseEntity<CandidatResponse> getCandidatInfo(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String username = jwtTokenService.getUsernameFromToken(token);
            System.out.println("Extracted username from token: " + username);
            User user = userService.findByUsername(username).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).build();
            }
            System.out.println("Found user with ID: " + user.getId());
            Candidat candidat = candidatService.findByUser(user).orElse(null);
            if (candidat == null) {
                // Auto-create Candidat entity with default values
                candidat = createDefaultCandidat(user);
            } 
                
            return ResponseEntity.ok(dtoMapper.toCandidatResponse(candidat));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).build();
        }
    }

    /**
     * Creates a default Candidat entity for a newly registered user
     */
    private Candidat createDefaultCandidat(User user) {
        // Get or create default country (Morocco)
        Pays defaultPays = paysRepository.findByNom("Maroc")
                .orElseGet(() -> paysRepository.save(Pays.builder().nom("Maroc").build()));
        
        Candidat candidat = Candidat.builder()
                .user(user)
                .cne("") // To be filled by user
                .cin("") // To be filled by user
                .villeDeNaissance("") // To be filled by user
                .ville("") // To be filled by user
                .dateDeNaissance(LocalDate.of(2000, 1, 1)) // Default date, to be updated
                .pays(defaultPays)
                .fonctionaire(false)
                .etatDossier(0) // Initial state
                .build();
        
        return candidatService.create(candidat);
    }

    // PUT /api/candidat-info/ - Update current candidat info
    @PutMapping("/candidat-info/")
    public ResponseEntity<CandidatResponse> updateCandidatInfo(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> candidatData) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String username = jwtTokenService.getUsernameFromToken(token);
            User user = userService.findByUsername(username).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).build();
            }
            
            Candidat candidat = candidatService.findByUser(user).orElse(null);
            if (candidat == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Update candidat fields from request body
            updateCandidatFromMap(candidat, candidatData);
            Candidat updated = candidatService.update(candidat.getId(), candidat);
            
            return ResponseEntity.ok(dtoMapper.toCandidatResponse(updated));
        } catch (Exception e) {
            return ResponseEntity.status(400).build();
        }
    }

    private void updateCandidatFromMap(Candidat candidat, Map<String, Object> data) {
        if (data.containsKey("cne")) candidat.setCne((String) data.get("cne"));
        if (data.containsKey("cin")) candidat.setCin((String) data.get("cin"));
        if (data.containsKey("adresse")) candidat.setAdresse((String) data.get("adresse"));
        if (data.containsKey("ville")) candidat.setVille((String) data.get("ville"));
        if (data.containsKey("telCandidat")) candidat.setTelCandidat((String) data.get("telCandidat"));
        if (data.containsKey("sexe")) candidat.setSexe((String) data.get("sexe"));
        if (data.containsKey("pathPhoto")) candidat.setPathPhoto((String) data.get("pathPhoto"));
        if (data.containsKey("pathCv")) candidat.setPathCv((String) data.get("pathCv"));
    }

    // GET /api/get-base-config/ - Get base configuration
    @GetMapping("/get-base-config/")
    public ResponseEntity<ConfigResponse> getBaseConfig() {
        // Return default configuration - in production this would come from database
        ConfigResponse config = ConfigResponse.builder()
                .maxSujetPostuler(3)
                .dateDebutPostulerSujetCandidat(LocalDate.now().minusMonths(1))
                .dateFinPostulerSujetCandidat(LocalDate.now().plusMonths(2))
                .dateDebutModifierSujetProf(LocalDate.now().minusMonths(2))
                .dateFinModifierSujetProf(LocalDate.now().plusMonths(1))
                .build();
        return ResponseEntity.ok(config);
    }

    // GET /api/candidat-parcours/ - Get candidat diplomes
    @GetMapping("/candidat-parcours/")
    public ResponseEntity<ResultDTO<DiplomeResponse>> getCandidatParcours(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String username = jwtTokenService.getUsernameFromToken(token);
            User user = userService.findByUsername(username).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).build();
            }
            
            Candidat candidat = candidatService.findByUser(user).orElse(null);
            if (candidat == null) {
                return ResponseEntity.ok(ResultDTO.of(Collections.emptyList()));
            }
            
            List<Diplome> diplomes = diplomeService.findByCandidat(candidat);
            List<DiplomeResponse> responses = diplomes.stream()
                    .map(d -> dtoMapper.toDiplomeResponse(d, Collections.emptyList()))
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(ResultDTO.of(responses));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    // POST /api/candidat-parcours/ - Add diplome
    @PostMapping("/candidat-parcours/")
    public ResponseEntity<ResultDTO<DiplomeResponse>> addDiplome(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Diplome diplome) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String username = jwtTokenService.getUsernameFromToken(token);
            User user = userService.findByUsername(username).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).build();
            }
            
            Candidat candidat = candidatService.findByUser(user).orElse(null);
            if (candidat == null) {
                return ResponseEntity.notFound().build();
            }
            
            diplome.setCandidat(candidat);
            diplomeService.create(diplome);
            
            // Return updated list
            List<Diplome> diplomes = diplomeService.findByCandidat(candidat);
            List<DiplomeResponse> responses = diplomes.stream()
                    .map(d -> dtoMapper.toDiplomeResponse(d, Collections.emptyList()))
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(ResultDTO.of(responses));
        } catch (Exception e) {
            return ResponseEntity.status(400).build();
        }
    }

    // PATCH /api/candidat-parcours/{id}/ - Update diplome
    @PatchMapping("/candidat-parcours/{id}/")
    public ResponseEntity<DiplomeResponse> updateDiplome(
            @PathVariable Long id,
            @RequestBody Diplome diplomeData) {
        try {
            Diplome updated = diplomeService.update(id, diplomeData);
            return ResponseEntity.ok(dtoMapper.toDiplomeResponse(updated, Collections.emptyList()));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /api/candidat-parcours/{id}/ - Delete diplome
    @DeleteMapping("/candidat-parcours/{id}/")
    public ResponseEntity<Void> deleteDiplome(@PathVariable Long id) {
        try {
            diplomeService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // GET /api/get-published-subjects/ - Get published sujets for candidat
    @GetMapping("/get-published-subjects/")
    public ResponseEntity<ResultDTO<SujetResponse>> getPublishedSubjects(
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer offset) {
        List<Sujet> sujets = sujetService.findByPublier(true);
        
        // Apply pagination if provided
        int start = offset != null ? offset : 0;
        int end = limit != null ? Math.min(start + limit, sujets.size()) : sujets.size();
        
        List<SujetResponse> responses = sujets.subList(start, end).stream()
                .map(dtoMapper::toSujetResponse)
                .collect(Collectors.toList());
        
        String next = end < sujets.size() ? 
                "/api/get-published-subjects/?limit=" + limit + "&offset=" + end : null;
        String previous = start > 0 ? 
                "/api/get-published-subjects/?limit=" + limit + "&offset=" + Math.max(0, start - limit) : null;
        
        return ResponseEntity.ok(ResultDTO.of(responses, sujets.size(), next, previous));
    }

    // GET /api/candidat-postules/ - Get candidat postulations
    @GetMapping("/candidat-postules/")
    public ResponseEntity<ResultDTO<PostulerResponse>> getCandidatPostules(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String username = jwtTokenService.getUsernameFromToken(token);
            User user = userService.findByUsername(username).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).build();
            }
            
            Candidat candidat = candidatService.findByUser(user).orElse(null);
            if (candidat == null) {
                return ResponseEntity.ok(ResultDTO.of(Collections.emptyList()));
            }
            
            List<Postuler> postules = postulerService.findByCandidat(candidat);
            List<PostulerResponse> responses = postules.stream()
                    .map(dtoMapper::toPostulerResponse)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(ResultDTO.of(responses));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    // POST /api/candidat-postules/ - Postuler for a sujet
    @PostMapping("/candidat-postules/")
    public ResponseEntity<PostulerResponse> postuler(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> body) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String username = jwtTokenService.getUsernameFromToken(token);
            User user = userService.findByUsername(username).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).build();
            }
            
            Candidat candidat = candidatService.findByUser(user).orElse(null);
            if (candidat == null) {
                return ResponseEntity.notFound().build();
            }
            
            Long sujetId = Long.valueOf(body.get("sujet").toString());
            Sujet sujet = sujetService.findById(sujetId).orElse(null);
            if (sujet == null) {
                return ResponseEntity.notFound().build();
            }
            
            Postuler postuler = Postuler.builder()
                    .candidat(candidat)
                    .sujet(sujet)
                    .build();
            
            Postuler created = postulerService.create(postuler);
            return new ResponseEntity<>(dtoMapper.toPostulerResponse(created), HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(400).build();
        }
    }

    // PATCH /api/candidat-postules/{id}/ - Update postulation
    @PatchMapping("/candidat-postules/{id}/")
    public ResponseEntity<PostulerResponse> updatePostuler(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        try {
            Postuler postuler = postulerService.findById(id).orElse(null);
            if (postuler == null) {
                return ResponseEntity.notFound().build();
            }
            
            if (body.containsKey("pathFile")) {
                postuler.setPathFile((String) body.get("pathFile"));
            }
            
            Postuler updated = postulerService.update(id, postuler);
            return ResponseEntity.ok(dtoMapper.toPostulerResponse(updated));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /api/candidat-postules/{id} - Delete postulation
    @DeleteMapping("/candidat-postules/{id}")
    public ResponseEntity<Void> deletePostuler(@PathVariable Long id) {
        try {
            postulerService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
