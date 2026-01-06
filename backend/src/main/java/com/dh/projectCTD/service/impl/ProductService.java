package com.dh.projectCTD.service.impl;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dh.projectCTD.dto.ProductDTO;
import com.dh.projectCTD.exception.ResourceNotFoundException;
import com.dh.projectCTD.model.Product;
import com.dh.projectCTD.repository.IProductRepository;
import com.dh.projectCTD.service.IProductService;

@Service
public class ProductService implements IProductService {

    private IProductRepository productRepository;
    private final S3Service s3Service;

    @Autowired
    public ProductService(IProductRepository productRepository, S3Service s3Service) {
        this.productRepository = productRepository;
        this.s3Service = s3Service;
    }

    @Override
    public ProductDTO save(ProductDTO dto, MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalStateException("File is empty");
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
        String imageUrl = s3Service.uploadFile(file);
        List<String> productImagesUrls = new ArrayList<>();
        productImagesUrls.add(imageUrl);
        productEntity.setImages(productImagesUrls.stream().toList());

        // Save in DB
        productRepository.save(productEntity);

        // DTO to return
        ProductDTO productDtoToReturn = new ProductDTO();
        productDtoToReturn.setProductId(productEntity.getId());
        productDtoToReturn.setName(productEntity.getName());
        productDtoToReturn.setDescription(productEntity.getDescription());
        productDtoToReturn.setAddress(productEntity.getAddress());
        productDtoToReturn.setCity(productEntity.getCity());
        productDtoToReturn.setImages(productEntity.getImages().stream().toList());
        // productDtoToReturn.setCategoryId(productEntity.getCategory().getId());

        return productDtoToReturn;
    }

    @Override
    public ProductDTO update(ProductDTO dto) throws Exception {
        
        if (productRepository.findById(dto.getProductId()).isPresent()) {
            Optional<Product> productEntity = productRepository.findById(dto.getProductId());

            // TODO Implementar categorías
            // Category categoryEntity = new Category();
            // categoryEntity.setId(dto.getCategoryId());

            List<String> productImagesUrls = new ArrayList<>();
            productImagesUrls.addAll(dto.getImages());
            productEntity.get().setImages(productImagesUrls.stream().toList());

            // Save in DB
            productRepository.save(productEntity.get());

            ProductDTO productDtoToReturn = new ProductDTO();
            productDtoToReturn.setProductId(productEntity.get().getId());
            productDtoToReturn.setImages(productEntity.get().getImages().stream().toList());
            // TODO Implementar categorías
            // productDtoToReturn.setCategoryId(productEntity.get().getCategory().getId());

            return productDtoToReturn;

        } else {
            throw new Exception("Product not found. Id: " + dto.getProductId());
        }

    }


    @Override
    public void deleteById(Long id) throws ResourceNotFoundException {
        Optional<Product> productToDelete = productRepository.findById(id);
        if(productToDelete.isPresent()) {
            productRepository.deleteById(id);
        } else {
            throw new ResourceNotFoundException("Product not found. Id: " + id);
        }
    }


    @Override
    public Optional<ProductDTO> findById(Long id) throws ResourceNotFoundException {
        Optional<Product> productToLookFor = productRepository.findById(id);
        Optional<ProductDTO> productDTO = null;

        if (productToLookFor.isPresent()) {
            Product productEntity = productToLookFor.get();

            ProductDTO productDtoToReturn = new ProductDTO();
            productDtoToReturn.setProductId(productEntity.getId());
            productDtoToReturn.setImages(productEntity.getImages().stream().toList());
            // productDtoToReturn.setCategoryId(productEntity.getCategory().getId());
            
            productDTO = Optional.of(productDtoToReturn);
            return productDTO;
        } else {
            throw new ResourceNotFoundException("Product not found. Id: " + id);
        }
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
                product.getImages().stream().toList()
            ));
        }
        return productDTOs;
    }

}