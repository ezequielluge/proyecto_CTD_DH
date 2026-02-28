package com.dh.projectCTD.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {

    private Long productId;

    @NotNull(message = "El ID de la categoría no puede ser nulo")
    private Long categoryId;
    
    private String categoryName;

    @NotBlank(message = "El nombre del producto no puede estar vacío")
    @Size(min = 3, max = 80, message = "El nombre del producto debe tener entre 3 y 80 caracteres")
    private String name;
    
    @Size(min = 10, max = 500, message = "La descripción del producto debe tener entre 10 y 500 caracteres")
    private String description;
    
    @Size(min = 5, max = 100, message = "La dirección del producto debe tener entre 5 y 100 caracteres")
    private String address;
    
    @Size(min = 2, max = 50, message = "La ciudad del producto debe tener entre 2 y 50 caracteres")
    private String city;
    
    @Size(min = 1, message = "Debe proporcionar al menos una imagen para el producto")
    private List<String> images;

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    
}