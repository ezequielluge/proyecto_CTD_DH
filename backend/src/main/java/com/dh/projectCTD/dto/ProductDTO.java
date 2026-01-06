package com.dh.projectCTD.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {

    @Getter @Setter
    private Long productId;

    // @Getter @Setter
    // private Long categoryId;

    @Getter @Setter
    private String name;
    
    @Getter @Setter
    private String description;
    
    @Getter @Setter
    private String address;
    
    @Getter @Setter
    private String city;
    
    @Getter @Setter
    private List<String> images;

}