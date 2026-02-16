package com.dh.projectCTD.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dh.projectCTD.exception.BadRequestException;
import com.dh.projectCTD.service.IStorageService;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StorageService implements IStorageService {

    @Value("${storage.type}")
    private String storageType;
    @Value("${storage.local.dir}")
    private String localStorageDir;

    private static final Logger logger = LoggerFactory.getLogger(StorageService.class);
    private S3Client s3Client;
    @Value("${aws.s3.bucket:none}")
    private String bucketName;

    public StorageService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    // Upload file to S3 or local storage based on configuration
    @Override
    public String uploadFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File must not be null or empty");
        }
        
        String fileName = UUID.randomUUID().toString() + "_"
                + file.getOriginalFilename().replace(" ", "_");
        
        try {
            // S3 upload logic
            if ("s3".equals(storageType)) {
                s3Client.putObject(PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(fileName)
                        .build(),
                        software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes()));

                return fileName;
            }

            // Local storage logic
            Path root = Paths.get(localStorageDir);
            if (!Files.exists(root)) Files.createDirectories(root);
            Files.copy(file.getInputStream(), root.resolve(fileName));
            return fileName;

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }

    }

    // List files from S3
    @Override
    public List<Object> listFiles() {
        if ("s3".equals(storageType)) {
            ListObjectsV2Response listObjects = s3Client.listObjectsV2(ListObjectsV2Request.builder()
                    .bucket(bucketName)
                    .build());
            List<Object> fileList = listObjects.contents().stream()
                    .map(S3Object::key)
                    .collect(Collectors.toList());
            return fileList;
        }

        return null;
    }

    // Get file URL from S3 or local storage based on configuration
    @Override
    public String getFileUrl(String fileName) {
        // S3 URL logic
        if ("s3".equals(storageType)) {
            String url = s3Client.utilities().getUrl(GetUrlRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .build()).toString();
            return url;
        }

        // Local URL logic
        return "http://localhost:8080" + localStorageDir + "/" + fileName;
    }

    // Delete file from S3 or local storage based on configuration
    @Override
    public void deleteFileByUrl(String url) {
        if (url == null || url.isEmpty())
            return;

        try {
            // S3 delete logic
            if ("s3".equals(storageType)) {
                if (url.contains(bucketName)) {
                    String encodedKey = url.substring(url.lastIndexOf("/") + 1);
                    String decodedKey = URLDecoder.decode(encodedKey, StandardCharsets.UTF_8);

                    s3Client.deleteObject(DeleteObjectRequest.builder()
                            .bucket(bucketName)
                            .key(decodedKey)
                            .build());
                }
            }
            // Local delete logic
            String fileName = url.substring(url.lastIndexOf("/") + 1);
            Path filePath = Paths.get(localStorageDir + "/" + fileName);
            Files.deleteIfExists(filePath);

        } catch (Exception e) {
            logger.error("Error deleting file from S3: {}", e.getMessage());
        }

    }
}