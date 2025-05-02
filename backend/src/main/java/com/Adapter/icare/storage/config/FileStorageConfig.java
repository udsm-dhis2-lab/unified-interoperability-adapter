package com.Adapter.icare.storage.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.FileSystemResource;

import java.io.File;
import java.io.IOException;

@Configuration
public class FileStorageConfig {

    @Value("${file.storage.location}")
    private String fileStorageLocation;

    @Bean
    public FileSystemResource fileStorage() throws IOException {
        File fileStorageDir = new File(fileStorageLocation);
        if (!fileStorageDir.exists()) {
            fileStorageDir.mkdirs();
        }
        return new FileSystemResource(fileStorageDir);
    }
}