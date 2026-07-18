package com.dh.projectCTD.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dh.projectCTD.dto.FeatureDTO;
import com.dh.projectCTD.service.IFeatureService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/feature")
@RequiredArgsConstructor
public class FeatureController {
    private final IFeatureService featureService;

    @GetMapping
    public ResponseEntity<List<FeatureDTO>> getAllFeatures() {
        return ResponseEntity.ok(featureService.getAllFeatures());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FeatureDTO> saveFeature(@RequestBody FeatureDTO dto) {
        return ResponseEntity.ok(featureService.save(dto));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FeatureDTO> updateFeature(
        @PathVariable Long id,
        @RequestBody FeatureDTO dto
    ) {
        return ResponseEntity.ok(featureService.update(id, dto));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteFeature(@PathVariable Long id) {
        featureService.delete(id);
        return ResponseEntity.ok("Feature deleted. Id: " + id);
    }
    
}
