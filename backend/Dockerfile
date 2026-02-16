FROM eclipse-temurin:17-jdk-alpine
RUN mkdir /data && mkdir /uploads
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Dspring.profiles.active=dev", "-jar", "/app.jar"]