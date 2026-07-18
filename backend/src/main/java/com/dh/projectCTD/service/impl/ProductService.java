package com.dh.projectCTD.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dh.projectCTD.dto.CategoryDTO;
import com.dh.projectCTD.dto.ProductDTO;
import com.dh.projectCTD.exception.BadRequestException;
import com.dh.projectCTD.exception.ResourceNotFoundException;
import com.dh.projectCTD.model.Category;
import com.dh.projectCTD.model.Feature;
import com.dh.projectCTD.model.Product;
import com.dh.projectCTD.repository.IProductRepository;
import com.dh.projectCTD.service.ICategoryService;
import com.dh.projectCTD.service.IFeatureService;
import com.dh.projectCTD.service.IProductService;
import com.dh.projectCTD.service.IStorageService;

import jakarta.transaction.Transactional;

@Service
public class ProductService implements IProductService {

    private IProductRepository productRepository;
    private final IStorageService storageService;
    private final ICategoryService categoryService;
    private final IFeatureService featureService;

    @Autowired
    public ProductService(IProductRepository productRepository, IStorageService storageService,
            ICategoryService categoryService, IFeatureService featureService) {
        this.productRepository = productRepository;
        this.storageService = storageService;
        this.categoryService = categoryService;
        this.featureService = featureService;
    }

    @Override
    public ProductDTO save(ProductDTO dto, List<MultipartFile> files) {
        if (productRepository.existsByName(dto.getName())) {
            throw new BadRequestException("Product with name " + dto.getName() + " already exists!");
        }

        if (files == null || files.isEmpty()) {
            throw new BadRequestException("No files provided!");
        }

        // Product entity to save in DB
        Product productEntity = new Product();
        productEntity.setName(dto.getName());
        productEntity.setDescription(dto.getDescription());
        productEntity.setAddress(dto.getAddress());
        productEntity.setCity(dto.getCity());

        Category category = new Category();
        category.setId(dto.getCategoryId());
        productEntity.setCategory(category);

        Set<Feature> features = featureService.getAllFeaturesByIds(dto.getFeaturesIds());
        productEntity.setFeatures(features);

        // Save image in S3 and get URL
        List<String> imageUrls = files.stream()
                .map(file -> {
                    String fileName = storageService.uploadFile(file);
                    return storageService.getFileUrl(fileName);
                })
                .collect(Collectors.toList());
        productEntity.setImages(imageUrls);

        // Save in DB
        productRepository.save(productEntity);
        categoryService.incrementProductsCount(dto.getCategoryId());

        return mapToDto(productEntity);
    }

    @Override
    @Transactional
    public ProductDTO update(ProductDTO dto, List<MultipartFile> files) {
        Product productEntity = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found. Id: " + dto.getProductId()));

        Category categoryEntity = new Category();
        categoryEntity.setId(dto.getCategoryId());

        List<Long> featuresIds = dto.getFeaturesIds().stream().map(Number::longValue).collect(Collectors.toList());
        Set<Feature> features = featureService.getAllFeaturesByIds(featuresIds);
        System.out.println(dto.getFeaturesIds());
        System.out.println("Features encontrados: " + features.size());

        // User URLs from DTO
        List<String> dtoUrls = dto.getImages() != null ? dto.getImages() : new ArrayList<>();

        // Urls filter to keep and to delete
        List<String> dbUrls = new ArrayList<>(productEntity.getImages());
        List<String> urlsToKeep = dbUrls.stream()
                .filter(dtoUrls::contains)
                .collect(Collectors.toList());

        List<String> urlsToDelete = dbUrls.stream()
                .filter(url -> !dtoUrls.contains(url))
                .collect(Collectors.toList());

        urlsToDelete.forEach(storageService::deleteFileByUrl);

        // New images to upload
        List<String> newImgUrls = new ArrayList<>();
        if (files != null && !files.isEmpty()) {
            newImgUrls = files.stream()
                    .map(file -> {
                        String fileName = storageService.uploadFile(file);
                        return storageService.getFileUrl(fileName);
                    })
                    .collect(Collectors.toList());
        }

        // Update fields
        productEntity.setName(dto.getName());
        productEntity.setDescription(dto.getDescription());
        productEntity.setAddress(dto.getAddress());
        productEntity.setCity(dto.getCity());
        productEntity.setCategory(categoryEntity);
        // Features clear manytomany old relations & update with new features relation
        productEntity.getFeatures().clear();
        productEntity.getFeatures().addAll(features);

        if (dto.getImages() != null || !newImgUrls.isEmpty()) {
            productEntity.getImages().clear();
            productEntity.getImages().addAll(urlsToKeep);
            productEntity.getImages().addAll(newImgUrls);
        }

        // Save in DB
        productRepository.save(productEntity);

        return mapToDto(productEntity);
    }

    @Override
    public void deleteById(Long id) {
        Optional<Product> productToDelete = productRepository.findById(id);
        if (productToDelete.isPresent()) {
            List<String> imageUrls = productToDelete.get().getImages();
            imageUrls.forEach(storageService::deleteFileByUrl);

            categoryService.decrementProductsCount(productToDelete.get().getCategory().getId());

            productRepository.deleteById(id);
        } else {
            throw new ResourceNotFoundException("Product not found. Id: " + id);
        }
    }

    @Override
    public Optional<ProductDTO> findById(Long id) {
        Product productEntity = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found. Id: " + id));

        return Optional.of(mapToDto(productEntity));
    }

    @Override
    public List<ProductDTO> findAll() {
        List<Product> products = productRepository.findAll();

        List<ProductDTO> productDTOs = new ArrayList<>();

        for (Product product : products) {
            productDTOs.add(mapToDto(product));
        }
        return productDTOs;
    }

    @Override
    public boolean existsByName(String name) {
        return productRepository.existsByName(name);
    }

    @Override
    public List<ProductDTO> findByCategories(List<Long> categoryIds) {
        List<Product> products = productRepository.findByCategory_IdIn(categoryIds);

        return products.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ProductDTO mapToDto(Product p) {
        ProductDTO dto = new ProductDTO();
        dto.setProductId(p.getId());
        dto.setCategoryId(p.getCategory().getId());
        dto.setCategoryName(categoryService.findById(p.getCategory().getId()).map(CategoryDTO::getName).orElse(null));
        dto.setName(p.getName());
        dto.setDescription(p.getDescription());
        dto.setAddress(p.getAddress());
        dto.setCity(p.getCity());
        dto.setImages(p.getImages().stream().toList());
        dto.setFeaturesIds(
            p.getFeatures()
            .stream()
            .map(f -> {
                return f.getId();
            }).collect(Collectors.toList()));
        return dto;
    }

}