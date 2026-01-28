package com.dh.projectCTD.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dh.projectCTD.model.Product;

@Repository
public interface IProductRepository extends JpaRepository<Product, Long>{
    boolean existsByName(String name);
}
