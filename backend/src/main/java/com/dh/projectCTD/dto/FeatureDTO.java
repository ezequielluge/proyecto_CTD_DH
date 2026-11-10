package com.dh.projectCTD.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class FeatureDTO {
    private Long id;

    @NotBlank(message = "El nombre de la característica es obligatorio")
    @Size(max = 50, message = "El nombre de la característica no puede superar los 50 caracteres")
    private String name;

    @NotBlank(message = "El ícono de la característica es obligatorio")
    private String icon;
}
