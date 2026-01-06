package com.dh.projectCTD.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "categories")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Category {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    @Getter @Setter
    private long id;

    @Column(name = "name")
    @Getter @Setter
    private String name;

    @Column(name = "images")
    @Getter @Setter
    private String imageUrl;

    @OneToMany(mappedBy = "id")
    @Getter @Setter
    private List<Product> products = new ArrayList<>();
    
}
