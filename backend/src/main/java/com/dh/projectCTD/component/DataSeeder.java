package com.dh.projectCTD.component;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.io.File;
import org.springframework.util.ResourceUtils;
import org.springframework.web.multipart.MultipartFile;

import com.dh.projectCTD.dto.CategoryDTO;
import com.dh.projectCTD.dto.ProductDTO;
import com.dh.projectCTD.service.ICategoryService;
import com.dh.projectCTD.service.IProductService;

import jakarta.transaction.Transactional;

@Component
@Profile("dev")
public class DataSeeder implements CommandLineRunner {

    private IProductService productService;
    private ICategoryService categoryService;

    private static final String DEFAULT_IMAGE_PATH = "classpath:default-image.jpg";

    private Long defaultCategoryId;
    private String defaultCategoryName = "Alojamientos";

    @Autowired
    public DataSeeder(ICategoryService categoryService, IProductService productService) {
        this.categoryService = categoryService;
        this.productService = productService;
    }

    // Data seeder
    @Transactional
    @Override
    public void run(String... args) throws Exception {
        initialCategoryLoader();
        initialProductLoader();
    }

    // Category seeder
    private void initialCategoryLoader() throws Exception {
        List<CategoryDTO> existingCategories = categoryService.findAll();
        if (existingCategories.isEmpty()) {
            System.out.println("### Seeding initial categories data...");

            // Default image mocking
            File file = ResourceUtils.getFile(DEFAULT_IMAGE_PATH);
            InputStream inputStream = Files.newInputStream(file.toPath());
            MockMultipartFile mockFile = new MockMultipartFile(
                    "file",
                    "default-image.jpg",
                    "image/jpeg",
                    inputStream);

            // DTO to save
            CategoryDTO cat1 = new CategoryDTO();
            cat1.setName(defaultCategoryName);
            cat1.setDescription("Categoría inicial");

            categoryService.save(cat1, mockFile);

            defaultCategoryId = categoryService.findAll().get(0).getCategoryId();

            System.out.println("### Categories seeding completed.");
        } else {
            defaultCategoryId = existingCategories.get(0).getCategoryId();
            System.out.println("### DB already has categories. Skipping seeding.");
        }
    }

    // Product seeding
    private void initialProductLoader() throws Exception {
        String catName = categoryService.findById(defaultCategoryId).get().getName();
        if (productService.findAll().isEmpty() && catName.equals(defaultCategoryName)) {
            System.out.println("### Seeding initial products data...");

            // Default Image mocking
            File file = ResourceUtils.getFile(DEFAULT_IMAGE_PATH);
            InputStream inputStream = Files.newInputStream(file.toPath());
            MockMultipartFile mockFile = new MockMultipartFile(
                    "file",
                    "default-image.jpg",
                    "image/jpeg",
                    inputStream);

            List<MultipartFile> files = new ArrayList<>();
            files.add(mockFile);

            for (int i = 1; i <= 10; i++) {
                // Product DTO to save
                ProductDTO prod = new ProductDTO();
                prod.setCategoryId(defaultCategoryId);
                prod.setName("Establecimiento " + i + " - " + (i % 2 == 0 ? "Hotel" : "Departamento"));
                prod.setDescription("Esta es la descripción detallada para el producto número " + i +
                        ". Ubicado en una zona privilegiada con todas las comodidades.");
                prod.setAddress("Calle Falsa " + (100 + i));
                prod.setCity(i % 3 == 0 ? "Buenos Aires" : "Neuquén");

                // Product list increment every 2 iterations
                if (i % 2 == 0) {
                    files.add(mockFile);
                }

                // Save product
                productService.save(prod, files);
            }
            System.out.println("### Products seeding completed.");
        } else {
            System.out.println("### DB already has products. Skipping seeding.");
        }
    }

}