package com.dh.projectCTD.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.dh.projectCTD.model.Category;

@Repository
public interface ICategoryRepository extends JpaRepository<Category, Long> {
    public Boolean existsByName(String name);
}