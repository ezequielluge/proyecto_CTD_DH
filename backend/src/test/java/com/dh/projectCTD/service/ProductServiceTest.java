package com.dh.projectCTD.service;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.dh.projectCTD.dto.ProductDTO;
import com.dh.projectCTD.service.impl.ProductService;

@SpringBootTest
class ProductServiceTest {

    @Autowired
    private ProductService productService;

    @Test
    void findById() {
        Long id = 3L;


        Optional<ProductDTO> productDto = null;

        try {
            productDto = productService.findById(id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        
        assertNotNull(productDto);
    }
}
