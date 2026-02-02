package com.dh.projectCTD.component;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;

import com.dh.projectCTD.model.Product;
import com.dh.projectCTD.repository.IProductRepository;

public class DataLoaderComponent implements ApplicationRunner {

    private final IProductRepository productRepository;

    @Autowired
    public DataLoaderComponent(IProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (productRepository.count() == 0) {
            
            List<Product> products = Arrays.asList(
                createProduct("Departamento Vista Mar", "Moderno depto con balcón frente a la playa.", "Av. Peralta Ramos 120", "Mar del Plata", 
                    Arrays.asList("URL_S3_IMAGEN_1", "URL_S3_IMAGEN_2")),
                
                createProduct("Cabaña Bosque Profundo", "Cabaña rústica de troncos con jacuzzi y estufa a leña.", "Camino al Llao Llao Km 15", "Bariloche", 
                    Arrays.asList("URL_S3_IMAGEN_3")),
                
                createProduct("Loft Industrial Palermo", "Espacio abierto con techos altos en el corazón de Palermo Soho.", "Costa Rica 4500", "Buenos Aires", 
                    Arrays.asList("URL_S3_IMAGEN_4", "URL_S3_IMAGEN_5")),
                
                createProduct("Hotel Boutique Histórico", "Habitaciones de lujo en una casona colonial restaurada.", "Caseros 200", "Salta", 
                    Arrays.asList("URL_S3_IMAGEN_6")),
                
                createProduct("Casa de Campo con Viñedos", "Estadía entre parras con cata de vinos incluida.", "Ruta del Vino 89", "Mendoza", 
                    Arrays.asList("URL_S3_IMAGEN_7", "URL_S3_IMAGEN_8")),
                
                createProduct("Eco-Lodge Selva", "Alojamiento sustentable a pasos de las Cataratas.", "Ruta 12 S/N", "Iguazú", 
                    Arrays.asList("URL_S3_IMAGEN_9")),
                
                createProduct("Apartamento Nordelta", "Seguridad y confort en un entorno exclusivo con vista al lago.", "Av. del Puerto 30", "Tigre", 
                    Arrays.asList("URL_S3_IMAGEN_10")),
                
                createProduct("Hostel Mochilero Premium", "Ambiente joven con áreas comunes modernas y piscina.", "España 150", "Mendoza", 
                    Arrays.asList("URL_S3_IMAGEN_11")),
                
                createProduct("Residencia Las Sierras", "Casa amplia para familias con piscina climatizada y asador.", "Cerro de las Rosas", "Villa General Belgrano", 
                    Arrays.asList("URL_S3_IMAGEN_12")),
                
                createProduct("Estudio Minimalista Recoleta", "Cerca de los mejores museos y cafés de la ciudad.", "Av. Alvear 1900", "Buenos Aires", 
                    Arrays.asList("URL_S3_IMAGEN_13")),
                
                createProduct("Chalet Suizo con Vista", "Arquitectura alpina con las mejores vistas al Cerro Catedral.", "Base del Cerro", "Bariloche", 
                    Arrays.asList("URL_S3_IMAGEN_14")),
                
                createProduct("Bungalow Privado", "Pequeño refugio privado para parejas cerca del río.", "Calle del Sol 44", "Villa Carlos Paz", 
                    Arrays.asList("URL_S3_IMAGEN_15"))
            );

            productRepository.saveAll(products);
            System.out.println("---- PRECARGA EXITOSA: 12 alojamientos insertados en la base de datos ----");
        }
    }

    // Método helper para crear productos rápidamente
    private Product createProduct(String name, String desc, String address, String city, List<String> images) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(desc);
        p.setAddress(address);
        p.setCity(city);
        p.setImages(images);
        return p;
    }
    
}
