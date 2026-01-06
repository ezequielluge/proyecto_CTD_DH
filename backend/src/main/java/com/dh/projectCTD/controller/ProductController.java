package com.dh.projectCTD.controller;

import java.io.File;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dh.projectCTD.dto.ProductDTO;
import com.dh.projectCTD.exception.ResourceNotFoundException;
import com.dh.projectCTD.service.IProductService;

@RestController
@RequestMapping("/products")
public class ProductController {
    
    private IProductService productService;

    @Autowired
    public ProductController(IProductService productService) {
        this.productService = productService;
    }

    // Endpoint to add Product
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<ProductDTO> save(@RequestBody ProductDTO productDTO, @RequestParam("file") MultipartFile file) {
        ResponseEntity<ProductDTO> response;

        // TODO Evaluar si la categoría existe con isPresent()
        // Por ahora es NULL
        // productDTO.setCategoryId(null);
        response = ResponseEntity.ok(productService.save(productDTO, file));
        
        return response;
    }

    // Endpoint to update Product
    // @PutMapping
    // public void update(@RequestBody Product product) {
    //     productService.update(product);
    // }

    // Endpoint to get all products
    @GetMapping
    public ResponseEntity<List<ProductDTO>> findAll() {
        return ResponseEntity.ok(productService.findAll());
    }

    // Endpoint to get product by id
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> findById(@RequestBody Long id) throws ResourceNotFoundException {
        Optional<ProductDTO> product = productService.findById(id);

        if (product.isPresent()) {
            return ResponseEntity.ok(product.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint to delete product by id
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@RequestBody Long id) throws ResourceNotFoundException{
        productService.deleteById(id);
        return ResponseEntity.ok("Product deleted, id: " + id);
    }
}
