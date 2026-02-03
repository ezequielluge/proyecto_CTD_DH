package com.dh.projectCTD.service;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.dh.projectCTD.dto.ProductDTO;

public interface IProductService {
    ProductDTO save(ProductDTO dto, List<MultipartFile> files);
    ProductDTO update(ProductDTO dto, List<MultipartFile> files);
    void deleteById(Long id);
    Optional<ProductDTO> findById(Long id);
    List<ProductDTO> findAll();
    public boolean existsByName(String name);
}