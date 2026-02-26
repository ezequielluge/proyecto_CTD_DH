package com.dh.projectCTD.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.http.MediaType;

import com.dh.projectCTD.dto.CategoryDTO;
import com.dh.projectCTD.repository.ICategoryRepository;
import com.dh.projectCTD.service.ICategoryService;

import tools.jackson.databind.ObjectMapper;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
public class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ICategoryService categoryService;

    @Autowired
    private ICategoryRepository categoryRepository;  

    private Long categoryId; 

    @BeforeEach
    void setUp() {
        categoryRepository.deleteAll();
        dataLoad();
    }

    void dataLoad() {
        CategoryDTO catDto = new CategoryDTO();
        catDto.setName("Category 1");
        catDto.setDescription("Description of Category 1");

        MockMultipartFile mockFile = new MockMultipartFile(
                "file",
                "test-image.jpg",
                "image/jpeg",
                "Test Image Content".getBytes()
        );
        CategoryDTO savedCategory = categoryService.save(catDto, mockFile);
        categoryId = savedCategory.getCategoryId();
    }

    // GET - ALL CATEGORIES SUCCESS
    @Test
    public void testGetAllCategories_Succcess() throws Exception {
        MvcResult response = mockMvc.perform(MockMvcRequestBuilders
            .get("/categories").accept("application/json"))
            .andDo(MockMvcResultHandlers.print())
            .andExpect(MockMvcResultMatchers.status().isOk())
            .andReturn();
        
        assertFalse(response.getResponse().getContentAsString().isEmpty());
    }

    // GET - CATEGORY BY ID SUCCESS
    @Test
    public void testGetCategoryById_Success() throws Exception {
        mockMvc.perform(get("/categories/{id}", categoryId)
                .contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.categoryId").value(categoryId))
                .andExpect(jsonPath("$.name").value("Category 1"))
                .andDo(MockMvcResultHandlers.print());
        
    }

    // GET - CATEGORY BY ID NOT FOUND
    @Test
    public void testGetCategoryById_NotFound() throws Exception {
        mockMvc.perform(get("/categories/{id}", 99L)
            .contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(status().isNotFound())
            .andDo(MockMvcResultHandlers.print());

    }

    // CREATE - CATEGORY SUCCESS
    @Test
    public void testCreateCategory_Success() throws Exception {
        CategoryDTO newDto = new CategoryDTO();
        newDto.setName("New Category");
        newDto.setDescription("Description of New Category");

        ObjectMapper mapper = new ObjectMapper();
        String categoryJson = mapper.writeValueAsString(newDto);

        MockMultipartFile categoryFile = new MockMultipartFile(
            "category",
            "",
            "application/json",
            categoryJson.getBytes()
        );

        MockMultipartFile imgFile = new MockMultipartFile(
                "file",
                "new-category.jpg",
                "image/jpeg",
                "Image content".getBytes()
        );

        mockMvc.perform(multipart("/categories")
                .file(categoryFile)
                .file(imgFile))
                .andExpect(status().isOk());
    }


    // CREATE - CATEGORY WITHOUT IMAGE FAIL
    @Test
    public void testCreateCategoryWithoutImage_Fail() throws Exception {
        CategoryDTO newDto = new CategoryDTO();
        newDto.setName("No Image Category");
        newDto.setDescription("Description of No Image Category");

        ObjectMapper mapper = new ObjectMapper();
        String categoryJson = mapper.writeValueAsString(newDto);

        MockMultipartFile categoryFile = new MockMultipartFile(
            "category",
            "",
            "application/json",
            categoryJson.getBytes()
        );

        mockMvc.perform(multipart("/categories")
                .file(categoryFile))
                .andExpect(status().isBadRequest());
    }

    // UPDATE - CATEGORY SUCCESS
    @Test
    public void testUpdateCategory_Success() throws Exception {
        CategoryDTO updateDto = new CategoryDTO();
        updateDto.setCategoryId(categoryId);
        updateDto.setName("Updated Category Name");
        updateDto.setDescription("Updated Description");
        updateDto.setImageUrl("updated-image.jpg");
        
        ObjectMapper mapper = new ObjectMapper();
        String categoryJson = mapper.writeValueAsString(updateDto);

        MockMultipartFile categoryFile = new MockMultipartFile(
            "category",
            "",
            "application/json",
            categoryJson.getBytes()
        );

        mockMvc.perform(multipart("/categories")
                .file(categoryFile)
                .with(request -> {
                    request.setMethod("PUT");
                    return request;
                }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.categoryId").value(categoryId))
                .andExpect(jsonPath("$.name").value("Updated Category Name"))
                .andExpect(jsonPath("$.description").value("Updated Description"))
                .andDo(MockMvcResultHandlers.print());
    }

    // UPDATE - CATEGORY ID NOT FOUND
    @Test
    public void testUpdateCategory_NotFound() throws Exception {
        CategoryDTO updateDto = new CategoryDTO();
        updateDto.setCategoryId(99L);
        updateDto.setName("Non-existent Category");

        ObjectMapper mapper = new ObjectMapper();
        String categoryJson = mapper.writeValueAsString(updateDto);

        MockMultipartFile categoryFile = new MockMultipartFile(
            "category",
            "",
            "application/json",
            categoryJson.getBytes()
        );

        mockMvc.perform(multipart("/categories")
                .file(categoryFile)
                .with(request -> {
                    request.setMethod("PUT");
                    return request;
                }))
                .andExpect(status().isNotFound())
                .andDo(MockMvcResultHandlers.print());
    }


    // DELETE - CATEGORY SUCCESS
    @Test
    public void testDeleteCategory_Success() throws Exception {
        mockMvc.perform(delete("/categories/{id}", categoryId))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());
    }

    // DELETE - CATEGORY NOT FOUND
    @Test
    public void testDeleteCategory_NotFound() throws Exception {
        mockMvc.perform(delete("/categories/{id}", 99L))
                .andExpect(status().isNotFound())
                .andDo(MockMvcResultHandlers.print());
    }
}
