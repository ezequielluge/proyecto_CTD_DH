package com.dh.projectCTD.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CategoryDTO {

    private Long categoryId;
    
    @NotBlank(message = "El nombre de la categoría no puede estar vacío")
    @Size(min = 3, max = 40, message = "El nombre de la categoría debe tener entre 3 y 40 caracteres")
    private String name;
    
    @NotBlank(message = "La descripción de la categoría no puede estar vacía")
    @Size(min = 10, max = 500, message = "La descripción de la categoría debe tener entre 10 y 500 caracteres")
    private String description;
    
    private String imageUrl;
    
    private Integer productsCount;
    
}
