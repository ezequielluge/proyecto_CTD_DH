package com.dh.projectCTD.model;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter @Setter
    private long id;

    @Column(nullable = false)
    @Getter @Setter
    private String name;

    @Column(length = 2000)
    @Getter @Setter
    private String description;

    // @ManyToOne
    // @JoinColumn(name = "category_id")
    // @Getter @Setter
    // private Category category;

    private String address;

    private String city;

    private List<String> images;

}
