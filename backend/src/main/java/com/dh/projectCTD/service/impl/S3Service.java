package com.dh.projectCTD.service.impl;

import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class S3Service {

    private static final Logger logger = LoggerFactory.getLogger(S3Service.class);
    private S3Client s3Client;
    @Value("${aws.s3.bucket}")
    private String bucketName;

    public S3Service(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public String uploadFile(MultipartFile file) {
        try {
            String fileName = UUID.randomUUID().toString() + "_"
                            + file.getOriginalFilename().replace(" ", "_");
            
            logger.info("Uploading file: {}", fileName);

            s3Client.putObject(PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(fileName)
                            .build(),
                    software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes()));
            
            logger.info("File uploaded successfully: {}", fileName);
            return fileName;
        } catch (IOException e) {
            logger.error("Failed to upload file", e);
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    public List<Object> listFiles() {
        logger.info("Fetching file list from bucket: {}", bucketName);
        ListObjectsV2Response listObjects = s3Client.listObjectsV2(ListObjectsV2Request.builder()
                .bucket(bucketName)
                .build());
        List<Object> fileList = listObjects.contents().stream()
                .map(S3Object::key)
                .collect(Collectors.toList());
        logger.info("Files retrieved: {}", fileList);
        return fileList;
    }

    public String getFileUrl(String fileName) {
        logger.info("Generating URL for file: {}", fileName);
        String url = s3Client.utilities().getUrl(GetUrlRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .build()).toString();
        logger.info("Generated URL: {}", url);
        return url;
    }

    public void deleteFileByUrl(String url) {
        if (url != null && url.contains(bucketName)) {
            try {
                String encodedKey = url.substring(url.lastIndexOf("/") + 1);
                String decodedKey = URLDecoder.decode(encodedKey, StandardCharsets.UTF_8);
                logger.info("Deleting file with key: {}", decodedKey);
                
                s3Client.deleteObject(DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(decodedKey)
                        .build());
            } catch (Exception e) {
                logger.error("Error deleting file from S3: {}", e.getMessage());
            }
        }
    }
}