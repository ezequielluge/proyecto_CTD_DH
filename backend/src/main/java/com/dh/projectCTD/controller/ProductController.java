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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dh.projectCTD.dto.ProductDTO;
import com.dh.projectCTD.exception.ResourceNotFoundException;
import com.dh.projectCTD.service.IProductService;
import com.fasterxml.jackson.databind.ObjectMapper;


@RestController
@RequestMapping("/products")
public class ProductController {

    private IProductService productService;

    @Autowired
    public ProductController(IProductService productService) {
        this.productService = productService;
    }

    // Endpoint to add Product
    @PostMapping(consumes = { "multipart/form-data" })
    public ResponseEntity<ProductDTO> save(
            @RequestPart("product") ProductDTO productJson,
            @RequestPart(value = "files") List<MultipartFile> files)
    {
        ObjectMapper mapper = new ObjectMapper();
        ProductDTO product = mapper.convertValue(productJson, ProductDTO.class);

        ResponseEntity<ProductDTO> response;

        // TODO Evaluar si la categoría existe con isPresent()

        response = ResponseEntity.ok(productService.save(product, files));

        return response;
    }

    // Endpoint to update Product
    @PutMapping(consumes = { "multipart/form-data" })
    public ResponseEntity<ProductDTO> update(
            @RequestPart("product") ProductDTO product,
            @RequestPart(value = "files", required = false) List<MultipartFile> newFiles
    ) throws Exception{
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
}
