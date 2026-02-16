package com.dh.projectCTD.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.dh.projectCTD.dto.ProductDTO;
import com.dh.projectCTD.exception.ResourceNotFoundException;
import com.dh.projectCTD.model.Product;
import com.dh.projectCTD.repository.IProductRepository;
import com.dh.projectCTD.service.impl.ProductService;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private IProductRepository productRepository;

    @Mock
    private IStorageService storageService;

    @InjectMocks
    private ProductService productService;

    private ProductDTO productDto;
    private Product product;

    @BeforeEach
    void setUp() {
        productDto = new ProductDTO();
        productDto.setProductId(1L);
        productDto.setName("Test Product");
        productDto.setImages(null);

        product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setImages(new ArrayList<>());
    }

    // Find by Id - Success
    @Test
    void testFindById_Success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        Optional<ProductDTO> optDto = productService.findById(1L);
        assertTrue(optDto.isPresent());
        assertEquals("Test Product", optDto.get().getName());   
    }

    // Find by Id - Not found
    @Test
    void testFindById_NotFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            productService.findById(99L);
        });
    }

    // Exists by name - Success
    @Test
    void testExistsByName_Success() {
        when(productRepository.existsByName("Test Product")).thenReturn(true);
        boolean exists = productService.existsByName("Test Product");
        assertTrue(exists);
    }
    
    // Exists by name - Not found
    @Test
    void testExistsByName_NotFound() {
        when(productRepository.existsByName("Fake Product")).thenReturn(false);
        boolean exists = productService.existsByName("Fake Product");
        assertFalse(exists);
    }

}
