package com.dh.projectCTD.service;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.dh.projectCTD.dto.CategoryDTO;

public interface ICategoryService {
    public CategoryDTO save(CategoryDTO dto, MultipartFile file);
    public CategoryDTO update(CategoryDTO dto, MultipartFile newFile);
    public List<CategoryDTO> findAll();
    public Optional<CategoryDTO> findById(Long id);
    public void deleteById(Long id);
    public Boolean existsByName(String name);
    
    public void incrementProductsCount(Long categoryId);
    public void decrementProductsCount(Long categoryId);
}
