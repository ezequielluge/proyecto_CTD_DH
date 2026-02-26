package com.dh.projectCTD.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dh.projectCTD.dto.CategoryDTO;
import com.dh.projectCTD.exception.BadRequestException;
import com.dh.projectCTD.exception.ResourceNotFoundException;
import com.dh.projectCTD.model.Category;
import com.dh.projectCTD.repository.ICategoryRepository;
import com.dh.projectCTD.service.ICategoryService;
import com.dh.projectCTD.service.IStorageService;

@Service
public class CategoryService implements ICategoryService {

    private ICategoryRepository categoryRepository;
    private IStorageService storageService;

    @Autowired
    public CategoryService(ICategoryRepository categoryRepository, IStorageService storageService) {
        this.categoryRepository = categoryRepository;
        this.storageService = storageService;
    }

    
    @Override
    public CategoryDTO save(CategoryDTO dto, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("No file provided!");
        }

        // Category entity to save in DB
        Category categoryEntity = new Category();
        categoryEntity.setName(dto.getName());
        categoryEntity.setDescription(dto.getDescription());

        // Save image in S3 and get URL
        String fileName = storageService.uploadFile(file);
        String imageUrl = storageService.getFileUrl(fileName);
        categoryEntity.setImageUrl(imageUrl);

        // Save category in DB
        Category savedCategory = categoryRepository.save(categoryEntity);

        return new CategoryDTO(
                savedCategory.getId(),
                savedCategory.getName(),
                savedCategory.getDescription(),
                savedCategory.getImageUrl(),
                savedCategory.getProductsCount()
        );
    }

    @Override
    public CategoryDTO update(CategoryDTO dto, MultipartFile newFile) {
        Category categoryEntity = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        categoryEntity.setName(dto.getName());
        categoryEntity.setDescription(dto.getDescription());

        if (newFile != null && !newFile.isEmpty()) {
            // Delete old image
            storageService.deleteFileByUrl(categoryEntity.getImageUrl());

            // Upload new image and get URL
            String fileName = storageService.uploadFile(newFile);
            String imageUrl = storageService.getFileUrl(fileName);
            categoryEntity.setImageUrl(imageUrl);
        }

        Category updatedCategory = categoryRepository.save(categoryEntity);

        return new CategoryDTO(
                updatedCategory.getId(),
                updatedCategory.getName(),
                updatedCategory.getDescription(),
                updatedCategory.getImageUrl(),
                updatedCategory.getProductsCount()
        );
    }

    @Override
    public List<CategoryDTO> findAll() {
        List<Category> categories = categoryRepository.findAll();
        List<CategoryDTO> categoryDTOs = new ArrayList<>();

        for (Category category : categories) {
            categoryDTOs.add(new CategoryDTO(
                    category.getId(),
                    category.getName(),
                    category.getDescription(),
                    category.getImageUrl(),
                    category.getProductsCount()
            ));
        }

        return categoryDTOs;
    }

    @Override
    public Optional<CategoryDTO> findById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        CategoryDTO categoryDTO = new CategoryDTO(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getImageUrl(),
                category.getProductsCount()
        );

        return Optional.of(categoryDTO);
    }

    @Override
    public void deleteById(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        if (categoryRepository.findById(id).get().getProductsCount() > 0) {
            throw new BadRequestException("Cannot delete category with associated products. Category id: " + id);
        }
        categoryRepository.deleteById(id);
    }

    @Override
    public Boolean existsByName(String name) {
        return categoryRepository.existsByName(name);
    }

    @Override
    public void incrementProductsCount(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));

        Integer currentCount = category.getProductsCount();
        if (currentCount == null || currentCount < 0) {
            category.setProductsCount(0);
        }

        category.setProductsCount(category.getProductsCount() + 1);
        categoryRepository.save(category);
    }
    
    @Override
    public void decrementProductsCount(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));

        Integer currentCount = category.getProductsCount();
        if (currentCount == null || currentCount <= 0) {
            category.setProductsCount(0);
        }

        if (category.getProductsCount() > 0) {
            category.setProductsCount(category.getProductsCount() - 1);
        }

        categoryRepository.save(category);
    }
    
}
