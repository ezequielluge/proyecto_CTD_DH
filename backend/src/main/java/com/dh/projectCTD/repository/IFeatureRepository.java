package com.dh.projectCTD.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dh.projectCTD.model.Feature;

public interface IFeatureRepository extends JpaRepository<Feature, Long>  {
    boolean existsByName(String name);
}
