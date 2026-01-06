package com.dh.projectCTD.controller;

import com.dh.projectCTD.service.impl.S3Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/s3")
public class S3Controller {

    private final S3Service s3Service;

    public S3Controller(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file) {
        return s3Service.uploadFile(file);
    }

    @PostMapping("/upload-multiple")
    public List<String> uploadMultiple(@RequestParam("files") MultipartFile[] files) {
        return Arrays.stream(files)
                .map(s3Service::uploadFile)
                .toList();
    }
}
