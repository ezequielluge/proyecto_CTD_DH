package com.dh.projectCTD.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
public class CategoryDTO {

    private Long categoryId;
    
    @NotBlank(message = "El nombre de la categoría no puede estar vacío")
    @Size(min = 3, max = 40, message = "El nombre de la categoría debe tener entre 3 y 40 caracteres")
    private String name;
    
    @Size(min = 10, max = 500, message = "La descripción de la categoría debe tener entre 10 y 500 caracteres")
    private String description;
    
    @NotBlank(message = "La URL de la imagen no puede estar vacía")
    private String imageUrl;
    
    private Integer productsCount;
    
    public Long getCategoryId() {
        return categoryId;
    }
    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getImageUrl() {
        return imageUrl;
    }
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    public Integer getProductsCount() {
        return productsCount;
    }
    public void setProductsCount(Integer productsCount) {
        this.productsCount = productsCount;
    }
    
}
