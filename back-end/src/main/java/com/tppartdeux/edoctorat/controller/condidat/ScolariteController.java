package com.tppartdeux.edoctorat.controller.condidat;

import com.tppartdeux.edoctorat.dto.ResultDTO;
import com.tppartdeux.edoctorat.dto.candidat.CandidatResponse;
import com.tppartdeux.edoctorat.model.candidat.Candidat;
import com.tppartdeux.edoctorat.service.DtoMapperService;
import com.tppartdeux.edoctorat.service.candidat.CandidatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ScolariteController {

    private final CandidatService candidatService;
    private final DtoMapperService dtoMapper;

    // GET /api/scolarite/ - Get all candidats for scolarite validation
    @GetMapping("/scolarite/")
    public ResponseEntity<ResultDTO<CandidatResponse>> getScolariteCandidats(
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer offset) {
        List<Candidat> candidats = candidatService.findAll();
        
        int start = offset != null ? offset : 0;
        int end = limit != null ? Math.min(start + limit, candidats.size()) : candidats.size();
        
        List<CandidatResponse> responses = candidats.subList(start, end).stream()
                .map(dtoMapper::toCandidatResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ResultDTO.of(responses, candidats.size(), null, null));
    }

    // PATCH /api/scolarite/{id}/ - Update candidat dossier status
    @PatchMapping("/scolarite/{id}/")
    public ResponseEntity<CandidatResponse> updateCandidatDossier(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        try {
            Candidat candidat = candidatService.findById(id).orElse(null);
            if (candidat == null) {
                return ResponseEntity.notFound().build();
            }
            
            if (body.containsKey("etatDossier")) {
                candidat.setEtatDossier(Integer.valueOf(body.get("etatDossier").toString()));
            }
            
            Candidat updated = candidatService.update(id, candidat);
            return ResponseEntity.ok(dtoMapper.toCandidatResponse(updated));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
