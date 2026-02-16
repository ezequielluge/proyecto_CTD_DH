package com.dh.projectCTD.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dh.projectCTD.dto.ProductDTO;
import com.dh.projectCTD.exception.BadRequestException;
import com.dh.projectCTD.exception.ResourceNotFoundException;
import com.dh.projectCTD.model.Product;
import com.dh.projectCTD.repository.IProductRepository;
import com.dh.projectCTD.service.IProductService;
import com.dh.projectCTD.service.IStorageService;

import jakarta.transaction.Transactional;

@Service
public class ProductService implements IProductService {

    private IProductRepository productRepository;
    private final IStorageService storageService;

    @Autowired
    public ProductService(IProductRepository productRepository, IStorageService storageService) {
        this.productRepository = productRepository;
        this.storageService = storageService;
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

        // TODO Implementar categorías
        // Category categoryEntity = new Category();
        // categoryEntity.setId(dto.getCategoryId());
        // productEntity.setCategory(categoryEntity);

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

        // DTO to return
        ProductDTO productDtoToReturn = new ProductDTO();
        productDtoToReturn.setProductId(productEntity.getId());
        productDtoToReturn.setName(productEntity.getName());
        productDtoToReturn.setDescription(productEntity.getDescription());
        productDtoToReturn.setAddress(productEntity.getAddress());
        productDtoToReturn.setCity(productEntity.getCity());
        productDtoToReturn.setImages(productEntity.getImages());
        // productDtoToReturn.setCategoryId(productEntity.getCategory().getId());

        return productDtoToReturn;
    }

    @Override
    @Transactional
    public ProductDTO update(ProductDTO dto, List<MultipartFile> files) {
        Product productEntity = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found. Id: " + dto.getProductId()));

        // TODO Implementar categorías
        // Category categoryEntity = new Category();
        // categoryEntity.setId(dto.getCategoryId());

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

        if (dto.getImages() != null || !newImgUrls.isEmpty()) {
            productEntity.getImages().clear();
            productEntity.getImages().addAll(urlsToKeep);
            productEntity.getImages().addAll(newImgUrls);
        }

        // Save in DB
        productRepository.save(productEntity);

        ProductDTO productDtoToReturn = new ProductDTO();
        productDtoToReturn.setProductId(productEntity.getId());
        productDtoToReturn.setImages(productEntity.getImages().stream().toList());
        productDtoToReturn.setName(productEntity.getName());
        productDtoToReturn.setDescription(productEntity.getDescription());
        productDtoToReturn.setAddress(productEntity.getAddress());
        productDtoToReturn.setCity(productEntity.getCity());
        // TODO Implementar categorías
        // productDtoToReturn.setCategoryId(productEntity.get().getCategory().getId());

        return productDtoToReturn;
    }

    @Override
    public void deleteById(Long id) {
        Optional<Product> productToDelete = productRepository.findById(id);
        if (productToDelete.isPresent()) {
            List<String> imageUrls = productToDelete.get().getImages();
            imageUrls.forEach(storageService::deleteFileByUrl);
            
            productRepository.deleteById(id);
        } else {
            throw new ResourceNotFoundException("Product not found. Id: " + id);
        }
    }

    @Override
    public Optional<ProductDTO> findById(Long id) {
        Product productEntity = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found. Id: " + id));

        ProductDTO dto = new ProductDTO();
        dto.setProductId(productEntity.getId());
        dto.setName(productEntity.getName());
        dto.setDescription(productEntity.getDescription());
        dto.setAddress(productEntity.getAddress());
        dto.setCity(productEntity.getCity());
        dto.setImages(productEntity.getImages());
        // TODO Category
        // productDtoToReturn.setCategoryId(productEntity.getCategory().getId());

        return Optional.of(dto);
    }

    @Override
    public List<ProductDTO> findAll() {
        List<Product> products = productRepository.findAll();

        List<ProductDTO> productDTOs = new ArrayList<>();

        for (Product product : products) {
            productDTOs.add(new ProductDTO(
                    product.getId(),
                    // product.getCategory().getId(),
                    product.getName(),
                    product.getDescription(),
                    product.getAddress(),
                    product.getCity(),
                    product.getImages().stream().toList()));
        }
        return productDTOs;
    }

    @Override
    public boolean existsByName(String name) {
        return productRepository.existsByName(name);
    }

}