package com.dh.projectCTD.service;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.dh.projectCTD.dto.ProductDTO;
import com.dh.projectCTD.exception.ResourceNotFoundException;

public interface IProductService {
    ProductDTO save(ProductDTO dto, MultipartFile file);
    ProductDTO update(ProductDTO dto) throws Exception;
    void deleteById(Long id) throws ResourceNotFoundException;
    Optional<ProductDTO> findById(Long id) throws ResourceNotFoundException;
    List<ProductDTO> findAll();
}