package com.dh.projectCTD.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface IS3Service {
    public String uploadFile(MultipartFile file);
    public List<Object> listFiles();
    public String getFileUrl(String fileName);
    public void deleteFileByUrl(String url);
    
}
