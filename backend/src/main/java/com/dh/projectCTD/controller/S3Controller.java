package com.dh.projectCTD.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.dh.projectCTD.service.impl.S3Service;

import java.util.List;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@CrossOrigin
public class S3Controller {

    private final S3Service s3Service;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        System.out.println(file.getName());
        String fileUrl = s3Service.uploadFile(file);
        return ResponseEntity.ok(fileUrl);
    }

    @GetMapping
    public ResponseEntity<List<Object>> listFiles() {
        return ResponseEntity.ok(s3Service.listFiles());
    }

    @GetMapping("/download")
    public ResponseEntity<String> downloadFile(@RequestParam("fileName") String fileName) {
        String url = s3Service.getFileUrl(fileName);
        return ResponseEntity.ok(url);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteFile(@RequestParam("fileName") String fileName) {
        s3Service.deleteFile(fileName);
        return ResponseEntity.ok("File deleted successfully");
    }
}