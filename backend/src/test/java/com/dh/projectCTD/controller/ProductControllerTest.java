package com.dh.projectCTD.controller;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.web.multipart.MultipartFile;

import com.dh.projectCTD.dto.ProductDTO;
import com.dh.projectCTD.service.IProductService;
import com.dh.projectCTD.service.IS3Service;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;

@SpringBootTest(properties = {
        "aws.accessKeyId=fakeKey",
        "aws.secretAccessKey=fakeSecret",
        "aws.region=us-east-1",
        "aws.s3.bucket=fake-bucket"
})
@AutoConfigureMockMvc
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private IS3Service s3Service;

    @Autowired
    private IProductService productService;

    private Long productId;

    @BeforeEach
    void setUp() {
        dataLoad();
    }

    void dataLoad() {
        // Mock S3 upload to return a fake URL
        when(s3Service.uploadFile(any())).thenReturn("http://fake-s3-url.com/img.jpg");

        // New product
        ProductDTO productDto = new ProductDTO();
        productDto.setName("Test Product");
        productDto.setDescription("Descripcion del producto");
        productDto.setAddress("San martin 100");
        productDto.setCity("CABA");

        List<MultipartFile> images = new ArrayList<>();
        MockMultipartFile img = new MockMultipartFile(
                "img",
                "img.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "img-data".getBytes()
        );
        images.add(img);

        ProductDTO savedProduct = productService.save(productDto, images);
        productId = savedProduct.getProductId();
    }

    @Test
    public void testGetAllProducts() throws Exception {
        MvcResult response = mockMvc.perform(MockMvcRequestBuilders
                .get("/products").accept("application/json"))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        assertFalse(response.getResponse().getContentAsString().isEmpty());
    }

    @Test
    public void testGetProductByIdSuccess() throws Exception {
        mockMvc.perform(get("/products/{id}", productId)
                .contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.productId").value(productId))
                .andExpect(jsonPath("$.name").value("Test Product"))
                .andExpect(jsonPath("$.description").value("Descripcion del producto"))
                .andExpect(jsonPath("$.address").value("San martin 100"))
                .andExpect(jsonPath("$.city").value("CABA"))
                .andDo(MockMvcResultHandlers.print());

    }

    @Test
    public void testGetProductByIdNotFound() throws Exception {
        mockMvc.perform(get("/products/{id}", 9999L)
                .contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().isNotFound())
                .andDo(MockMvcResultHandlers.print());
    }

}
