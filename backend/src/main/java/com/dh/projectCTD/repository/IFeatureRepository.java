package com.dh.projectCTD.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dh.projectCTD.model.Feature;

public interface IFeatureRepository extends JpaRepository<Feature, Long> {
    boolean existsByName(String name);

    @Query(value = "SELECT COUNT(*) FROM product_features WHERE feature_id = :featureId", nativeQuery = true)
    int countAssociatedProducts(@Param("featureId") Long featureId);
}
