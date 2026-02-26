# Proyecto: Reservas de hoteles

## Propósito
El propósito del proyecto es crear una aplicación web de reservas con el fin de manejar disponibilidades de los servicios, específicamente alojamiento.
El nombre del sitio será “Fast Booking”

## Solución Propuesta
La solución consiste en el desarrollo de una página web moderna y funcional que cumpla con las historias de usuario planteadas para el Sprint 1.
El front-end estará basado en React, utilizando Bootstrap como librería de estilos y un componente de ShadCN, específicamente el calendario del hero section.
El back-end estará diseñado mediante Spring Boot, con models como el Product; y una conexión con AWS S3 para el almacenamiento de las imágenes de los alojamientos cuando se encuentre en producción.

## Ejecución
El archivo Docker-compose.yml está configurado para un entorno de desarrollo
por lo que guardará las imágenes en el directorio /backend_uploads en vez de en AWS S3.

Por otro lado, los productos serán persistentes con H2 en el directorio /backend_data.

1. Ejecutar "mvn clean package -DskipTests" en el directorio /backend
2. Ejecutar "docker-compose up --build" en la raíz del proyecto

Acceso al frontend: http://localhost:5173
Acceso al backend: http://localhost:8080

Para detener el proyecto ejecutar "docker-compose down"

## Tests
Para ejecutar los tests se puede realizar de forma general o específicos.

Ejemplos de comandos dentro del directorio /backend:
- "mvn test"
- "mvn test -Dtest=ProductControllerTest"
- "mvn test -Dtest=ProductServiceTest"

## Sprint 1
El Sprint 1 del proyecto consta de desarrollar la estructura básica del sitio web de forma tal que se puedan crear, visualizar y eliminar productos.
Algunos de los tests realizados por el back-end en esta fase son:
- GET all products
- GET product by id
- CREATE product
- PUT update product
- DELETE product

Todos con el caso de éxito y casos de errores comunes como lo son al no encontrar el ID del producto.

## Sprint 2
Implementación de correcciones del primer sprint:
- Validaciones en Backend y DTOs con @Valid y Spring Validator
- Data seeder para el inicio del proyecto
- Validación por tipo de archivo en el manejo de imágenes

Del propio sprint se agregó la categorización de productos, los roles de usuarios, 
las características de productos y la notificación por email de registro exitoso de usuario.

## Diseño
La paleta de colores utilizada es:
- #1E3A5F
- #3A6EA5
- #F4F6F8
- #1F2933
- #2FBF71
