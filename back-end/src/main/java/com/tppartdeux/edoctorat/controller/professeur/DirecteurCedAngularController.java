package com.tppartdeux.edoctorat.controller.professeur;

import com.tppartdeux.edoctorat.dto.ResultDTO;
import com.tppartdeux.edoctorat.dto.professeur.*;
import com.tppartdeux.edoctorat.model.professeur.*;
import com.tppartdeux.edoctorat.service.DtoMapperService;
import com.tppartdeux.edoctorat.service.professeur.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DirecteurCedAngularController {

    private final SujetService sujetService;
    private final CommissionService commissionService;
    private final ExaminerService examinerService;
    private final InscriptionService inscriptionService;
    private final DtoMapperService dtoMapper;

    // GET /api/get-ced-sujets/ - Get sujets for CED
    @GetMapping("/get-ced-sujets/")
    public ResponseEntity<ResultDTO<SujetResponse>> getCedSujets(
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

    // GET /api/get-ced-candidats/ - Get candidats (examiners) for CED
    @GetMapping("/get-ced-candidats/")
    public ResponseEntity<ResultDTO<ExaminerResponse>> getCedCandidats(
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

    // GET /api/get-ced-commissions/ - Get commissions for CED
    @GetMapping("/get-ced-commissions/")
    public ResponseEntity<ResultDTO<CommissionResponse>> getCedCommissions() {
        List<Commission> commissions = commissionService.findAll();
        List<CommissionResponse> responses = commissions.stream()
                .map(c -> dtoMapper.toCommissionResponse(c, Collections.emptyList(), Collections.emptyList()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ResultDTO.of(responses));
    }

    // GET /api/get-ced-inscriptions/ - Get all inscriptions for CED
    @GetMapping("/get-ced-inscriptions/")
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

    // GET /api/get-ced-resultats/ - Get resultats for CED
    @GetMapping("/get-ced-resultats/")
    public ResponseEntity<ResultDTO<ExaminerResponse>> getCedResultats(
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer offset) {
        // Return published examiners
        List<Examiner> examiners = examinerService.findByPublier(true);
        
        int start = offset != null ? offset : 0;
        int end = limit != null ? Math.min(start + limit, examiners.size()) : examiners.size();
        
        List<ExaminerResponse> responses = examiners.subList(start, end).stream()
                .map(dtoMapper::toExaminerResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ResultDTO.of(responses, examiners.size(), null, null));
    }
    
    // GET /api/download-registration-report - Download registration report
    @GetMapping("/download-registration-report")
    public ResponseEntity<byte[]> downloadRegistrationReport() {
        try {
            // This would typically generate an Excel/PDF report of registrations
            // For now, returning a placeholder response
            byte[] reportData = "Sample Report Content".getBytes();
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=rapport-inscriptions.xlsx")
                    .contentType(org.springframework.http.MediaType.APPLICATION_OCTET_STREAM)
                    .body(reportData);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
