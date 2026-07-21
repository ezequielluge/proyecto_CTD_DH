package com.dh.projectCTD.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dh.projectCTD.dto.CategoryDTO;
import com.dh.projectCTD.service.ICategoryService;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private ICategoryService categoryService;

    @Autowired
    public CategoryController(ICategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // Get all categories
    @GetMapping
    public ResponseEntity<List<CategoryDTO>> findAll() {
        return ResponseEntity.ok(categoryService.findAll());
    }

    // Get category by id
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> findById(@PathVariable Long id) {
        Optional<CategoryDTO> category = categoryService.findById(id);

        if (category.isPresent()) {
            return ResponseEntity.ok(category.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Create category
    @PostMapping(consumes = { "multipart/form-data" })
    public ResponseEntity<CategoryDTO> save(
            @Valid @RequestPart("category") CategoryDTO categoryJson,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        ObjectMapper mapper = new ObjectMapper();
        CategoryDTO category = mapper.convertValue(categoryJson, CategoryDTO.class);
        
        return ResponseEntity.ok(categoryService.save(category, file));
    }

    // Update category
    @PutMapping(value = "/{id}", consumes = { "multipart/form-data" })
    public ResponseEntity<CategoryDTO> update(
            @PathVariable Long id,
            @Valid @RequestPart("category") CategoryDTO category,
            @RequestPart(value = "file", required = false) MultipartFile newFile)
        {
            
        if (id != category.getCategoryId()) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(categoryService.update(category, newFile));
    }

    // Delete category id
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteById(@PathVariable Long id) {
        categoryService.deleteById(id);
        return ResponseEntity.ok("Category deleted, id: " + id);
    }
}
