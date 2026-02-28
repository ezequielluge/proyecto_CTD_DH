package com.dh.projectCTD.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dh.projectCTD.dto.ProductDTO;
import com.dh.projectCTD.exception.ResourceNotFoundException;
import com.dh.projectCTD.service.ICategoryService;
import com.dh.projectCTD.service.IProductService;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/products")
public class ProductController {

    private IProductService productService;
    private ICategoryService categoryService;

    @Autowired
    public ProductController(IProductService productService, ICategoryService categoryService) {
        this.productService = productService;
        this.categoryService = categoryService;
    }

    // Endpoint to add Product
    @PostMapping(consumes = { "multipart/form-data" })
    public ResponseEntity<ProductDTO> save(
            @Valid @RequestPart("product") ProductDTO productJson,
            @RequestPart(value = "files") List<MultipartFile> files) {
        ObjectMapper mapper = new ObjectMapper();
        ProductDTO product = mapper.convertValue(productJson, ProductDTO.class);

        ResponseEntity<ProductDTO> response;

        if (categoryService.findById(product.getCategoryId()).isPresent()) {
            response = ResponseEntity.ok(productService.save(product, files));
        } else {
            response = ResponseEntity.badRequest().build();
        }

        return response;
    }

    // Endpoint to update Product
    @PutMapping(value = "/{id}", consumes = { "multipart/form-data" })
    public ResponseEntity<ProductDTO> update(
            @PathVariable Long id,
            @Valid @RequestPart("product") ProductDTO product,
            @RequestPart(value = "files", required = false) List<MultipartFile> newFiles) throws Exception {
        
        if (id != product.getProductId()) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(productService.update(product, newFiles));
    }

    // Endpoint to get all products
    @GetMapping
    public ResponseEntity<List<ProductDTO>> findAll() {
        return ResponseEntity.ok(productService.findAll());
    }

    // Endpoint to get product by id
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> findById(@PathVariable Long id) throws ResourceNotFoundException {
        Optional<ProductDTO> product = productService.findById(id);

        if (product.isPresent()) {
            return ResponseEntity.ok(product.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint to delete product by id
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) throws ResourceNotFoundException {
        productService.deleteById(id);
        return ResponseEntity.ok("Product deleted, id: " + id);
    }

    // Check name for new product
    @GetMapping("/check-name")
    public ResponseEntity<Boolean> checkName(@RequestParam String name) {
        boolean exists = productService.existsByName(name);
        return ResponseEntity.ok(exists);
    }

    // Filter by categories
    @GetMapping("/filter/category")
    public ResponseEntity<List<ProductDTO>> filterByCategories(@RequestParam List<Long> categoryIds) {
        return ResponseEntity.ok(productService.findByCategories(categoryIds));
    }
}
