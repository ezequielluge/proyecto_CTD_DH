package com.dh.projectCTD.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.dh.projectCTD.dto.FeatureDTO;
import com.dh.projectCTD.exception.BadRequestException;
import com.dh.projectCTD.exception.FeatureAlreadyExistsException;
import com.dh.projectCTD.exception.ResourceNotFoundException;
import com.dh.projectCTD.model.Feature;
import com.dh.projectCTD.repository.IFeatureRepository;
import com.dh.projectCTD.service.IFeatureService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FeatureService implements IFeatureService {

    private final IFeatureRepository featureRepository;

    @Override
    public List<FeatureDTO> getAllFeatures() {
        return featureRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public FeatureDTO save(FeatureDTO dto) {
        if (featureRepository.existsByName(dto.getName()))
            throw new FeatureAlreadyExistsException("Feature name already exists.");

        Feature feature = Feature.builder()
                .name(dto.getName())
                .icon(dto.getIcon())
                .build();

        Feature savedFeature = featureRepository.save(feature);
        return mapToDto(savedFeature);
    }

    @Override
    public FeatureDTO update(Long id, FeatureDTO dto) {
        Feature existingFeature = featureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No feature found with id " + id));

        if (dto.getName().length() < 1)
            throw new IllegalArgumentException("Name invalid.");

        existingFeature.setName(dto.getName());
        existingFeature.setIcon(dto.getIcon());

        Feature updatedFeature = featureRepository.save(existingFeature);
        return mapToDto(updatedFeature);
    }

    @Override
    public void delete(Long id) {
        if (!featureRepository.existsById(id))
            throw new ResourceNotFoundException("No feature found with id " + id);
        if (featureRepository.countAssociatedProducts(id) > 0)
            throw new BadRequestException("Cannot delete a feature with associated products. Feature id: " + id);

        featureRepository.deleteById(id);
    }

    private FeatureDTO mapToDto(Feature f) {
        FeatureDTO dto = new FeatureDTO();
        dto.setId(f.getId());
        dto.setName(f.getName());
        dto.setIcon(f.getIcon());
        return dto;
    }

    @Override
    public Set<Feature> getAllFeaturesByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) return new HashSet<>();
        
        return new HashSet<>(featureRepository.findAllById(ids));
    }

}
