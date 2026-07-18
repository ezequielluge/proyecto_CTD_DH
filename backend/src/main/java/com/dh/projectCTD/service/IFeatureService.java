package com.dh.projectCTD.service;

import java.util.List;
import java.util.Set;

import com.dh.projectCTD.dto.FeatureDTO;
import com.dh.projectCTD.model.Feature;

public interface IFeatureService {
    List<FeatureDTO> getAllFeatures();
    FeatureDTO save(FeatureDTO dto);
    FeatureDTO update(Long id, FeatureDTO dto);
    void delete(Long id);
    Set<Feature> getAllFeaturesByIds(List<Long> ids);
}
