package com.dh.projectCTD.component;

import com.dh.projectCTD.service.impl.FeatureService;
import com.dh.projectCTD.service.impl.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

import com.dh.projectCTD.authentication.AuthenticationService;
import com.dh.projectCTD.dto.CategoryDTO;
import com.dh.projectCTD.dto.FeatureDTO;
import com.dh.projectCTD.dto.ProductDTO;
import com.dh.projectCTD.model.Role;
import com.dh.projectCTD.model.User;
import com.dh.projectCTD.repository.IUserRepository;
import com.dh.projectCTD.service.ICategoryService;
import com.dh.projectCTD.service.IFeatureService;
import com.dh.projectCTD.service.IProductService;

import jakarta.transaction.Transactional;

@Component
@Profile("dev")
public class DataSeeder implements CommandLineRunner {

    private final UserService userService;
    private final IUserRepository userRepository;
    private final IProductService productService;
    private final ICategoryService categoryService;
    private final IFeatureService featureService;
    private final PasswordEncoder passwordEncoder;

    private static final String DEFAULT_IMAGE_PATH = "default-image.jpg";

    // Bytes leídos una sola vez y reutilizados en todos los seeds
    private byte[] defaultImageBytes;

    private Long defaultCategoryId;
    private String defaultCategoryName = "Alojamientos";
    
    private Long defaultFeatureId;
    private String defaultFeatureName = "Wifi";
    private String defaultFeatureIcon = "wifi";
    
    @Autowired
    public DataSeeder(
        ICategoryService categoryService,
        IUserRepository userRepository,
        IProductService productService,
        UserService userService,
        AuthenticationService authenticationService,
        FeatureService featureService,
        PasswordEncoder passwordEncoder
    ) {
        this.categoryService = categoryService;
        this.productService = productService;
        this.userService = userService;
        this.userRepository = userRepository;
        this.featureService = featureService;
        this.passwordEncoder = passwordEncoder;
    }

    // Data seeder
    @Transactional
    @Override
    public void run(String... args) throws Exception {
        defaultImageBytes = loadDefaultImage();
        initialCategoryLoader();
        initialFeatureLoader();
        initialProductLoader();
        initialAdminLoader();
    }

    // Category seeder
    private void initialCategoryLoader() throws Exception {
        List<CategoryDTO> existingCategories = categoryService.findAll();
        if (existingCategories.isEmpty()) {
            System.out.println("### Seeding initial categories data...");

            MultipartFile defaultImage = defaultImageFile("file");

            // DTO to save
            CategoryDTO cat1 = new CategoryDTO();
            cat1.setName(defaultCategoryName);
            cat1.setDescription("Categoría inicial");

            categoryService.save(cat1, defaultImage);

            defaultCategoryId = categoryService.findAll().get(0).getCategoryId();

            System.out.println("### Categories seeding completed.");
        } else {
            defaultCategoryId = existingCategories.get(0).getCategoryId();
            System.out.println("### DB already has categories. Skipping seeding.");
        }
    }

    // Product seeder
    private void initialProductLoader() throws Exception {
        String catName = categoryService.findById(defaultCategoryId).get().getName();
        if (productService.findAll().isEmpty() && catName.equals(defaultCategoryName)) {
            System.out.println("### Seeding initial products data...");

            MultipartFile defaultImage = defaultImageFile("files");

            List<MultipartFile> files = new ArrayList<>();
            files.add(defaultImage);

            List<Long> featuresIds = new ArrayList<>();
            featuresIds.add(defaultFeatureId);

            for (int i = 1; i <= 10; i++) {
                // Product DTO to save
                ProductDTO prod = new ProductDTO();
                prod.setCategoryId(defaultCategoryId);
                prod.setName("Establecimiento " + i + " - " + (i % 2 == 0 ? "Hotel" : "Departamento"));
                prod.setDescription("Esta es la descripción detallada para el producto número " + i +
                        ". Ubicado en una zona privilegiada con todas las comodidades.");
                prod.setAddress("Calle Falsa " + (100 + i));
                prod.setCity(i % 3 == 0 ? "Buenos Aires" : "Neuquén");
                prod.setFeaturesIds(i % 2 == 0 ? new ArrayList<>() : featuresIds);

                // Product list increment every 2 iterations
                if (i % 2 == 0) {
                    files.add(defaultImage);
                }

                // Save product
                productService.save(prod, files);
            }
            System.out.println("### Products seeding completed.");
        } else {
            System.out.println("### DB already has products. Skipping seeding.");
        }
    }

    // Admin user seeder
    private void initialAdminLoader() throws Exception{
        if (userService.getAllUsers().isEmpty()) {
            System.out.println("### Seeding initial admin user data...");

            var adminUser = User.builder()
                .firstname("Admin")
                .lastname("Sistema")
                .email("admin@admin.com")
                .password(passwordEncoder.encode("admin"))
                .role(Role.ROLE_ADMIN)
                .build();
            userRepository.save(adminUser);
            
            System.out.println("### User seeding completed.");
        } else {
            System.out.println("### DB already has users. Skipping seeding.");
        }
    }
    
    // Features seeder
    private void initialFeatureLoader() throws Exception {
        if (featureService.getAllFeatures().isEmpty()) {
            System.out.println("### Seeding initial features data...");
        
            FeatureDTO wifiDto = new FeatureDTO();
            wifiDto.setName(defaultFeatureName);
            wifiDto.setIcon(defaultFeatureIcon);
            defaultFeatureId = featureService.save(wifiDto).getId();

            System.out.println("### Features seeding completed.");
        } else {
            System.out.println("### DB already has features. Skipping seeding.");
        }
    }

    // Lee la imagen por defecto desde el classpath (funciona también dentro del JAR)
    private byte[] loadDefaultImage() throws IOException {
        try (InputStream in = new ClassPathResource(DEFAULT_IMAGE_PATH).getInputStream()) {
            return in.readAllBytes();
        }
    }

    private MultipartFile defaultImageFile(String fieldName) {
        return new ByteArrayMultipartFile(fieldName, DEFAULT_IMAGE_PATH, "image/jpeg", defaultImageBytes);
    }

    // Implementación mínima de MultipartFile en memoria, para no depender de spring-test
    private static final class ByteArrayMultipartFile implements MultipartFile {
        private final String name;
        private final String originalFilename;
        private final String contentType;
        private final byte[] content;

        ByteArrayMultipartFile(String name, String originalFilename, String contentType, byte[] content) {
            this.name = name;
            this.originalFilename = originalFilename;
            this.contentType = contentType;
            this.content = content != null ? content : new byte[0];
        }

        @Override public String getName() { return name; }
        @Override public String getOriginalFilename() { return originalFilename; }
        @Override public String getContentType() { return contentType; }
        @Override public boolean isEmpty() { return content.length == 0; }
        @Override public long getSize() { return content.length; }
        @Override public byte[] getBytes() { return content; }
        @Override public InputStream getInputStream() { return new ByteArrayInputStream(content); }
        @Override public void transferTo(File dest) throws IOException { Files.write(dest.toPath(), content); }
    }

}