package com.dh.projectCTD.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dh.projectCTD.dto.ProductDTO;
import com.dh.projectCTD.exception.ResourceNotFoundException;
import com.dh.projectCTD.model.Product;
import com.dh.projectCTD.repository.IProductRepository;
import com.dh.projectCTD.service.IProductService;
import com.dh.projectCTD.service.IS3Service;

import jakarta.transaction.Transactional;

@Service
public class ProductService implements IProductService {

    private IProductRepository productRepository;
    private final IS3Service s3Service;

    @Autowired
    public ProductService(IProductRepository productRepository, IS3Service s3Service) {
        this.productRepository = productRepository;
        this.s3Service = s3Service;
    }

    @Override
    public ProductDTO save(ProductDTO dto, List<MultipartFile> files) {
        if (productRepository.existsByName(dto.getName())) {
            throw new IllegalStateException("Product with name " + dto.getName() + " already exists!");
        }

        if (files == null || files.isEmpty()) {
            throw new IllegalStateException("No files provided!");
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
                    String fileName = s3Service.uploadFile(file);
                    return s3Service.getFileUrl(fileName);
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
    public ProductDTO update(ProductDTO dto, List<MultipartFile> files) throws Exception {
        Product productEntity = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new Exception("Product not found. Id: " + dto.getProductId()));

        // TODO Implementar categorías
        // Category categoryEntity = new Category();
        // categoryEntity.setId(dto.getCategoryId());

        // Lista de URLs que el usuario envió en el JSON (lo que quiere que quede)
        List<String> dtoUrls = dto.getImages() != null ? dto.getImages() : new ArrayList<>();

        // Lista de URLs que existen actualmente en la base de datos
        List<String> dbUrls = new ArrayList<>(productEntity.getImages());

        // Intersección: URLs que están en AMBOS (las que se conservan)
        List<String> urlsToKeep = dbUrls.stream()
                .filter(dtoUrls::contains)
                .collect(Collectors.toList());

        // Diferencia: URLs que están en la DB pero NO en el DTO (las que hay que borrar
        // de S3)
        List<String> urlsToDelete = dbUrls.stream()
                .filter(url -> !dtoUrls.contains(url))
                .collect(Collectors.toList());

        // 2. Ejecutar el borrado físico en S3
        urlsToDelete.forEach(s3Service::deleteFileByUrl);

        // 3. Procesar archivos nuevos (binarios) si existen
        List<String> newImgUrls = new ArrayList<>();
        if (files != null && !files.isEmpty()) {
            newImgUrls = files.stream()
                    .map(file -> {
                        String fileName = s3Service.uploadFile(file);
                        return s3Service.getFileUrl(fileName);
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
    public void deleteById(Long id) throws ResourceNotFoundException {
        Optional<Product> productToDelete = productRepository.findById(id);
        if (productToDelete.isPresent()) {
            // Borrar imágenes de S3
            List<String> imageUrls = productToDelete.get().getImages();
            imageUrls.forEach(s3Service::deleteFileByUrl);
            // Borrar producto de la DB
            productRepository.deleteById(id);
        } else {
            throw new ResourceNotFoundException("Product not found. Id: " + id);
        }
    }

    @Override
    public Optional<ProductDTO> findById(Long id) throws ResourceNotFoundException {
        return productRepository.findById(id)
                .map(productEntity -> {
                    // Mapeo de Entity a DTO
                    ProductDTO dto = new ProductDTO();
                    dto.setProductId(productEntity.getId());
                    dto.setName(productEntity.getName());
                    dto.setDescription(productEntity.getDescription());
                    dto.setAddress(productEntity.getAddress());
                    dto.setCity(productEntity.getCity());
                    dto.setImages(productEntity.getImages());
                    // productDtoToReturn.setCategoryId(productEntity.getCategory().getId());
                    return dto;
                })
                .or(() -> {
                    throw new RuntimeException("Product not found. Id: " + id);
                });
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