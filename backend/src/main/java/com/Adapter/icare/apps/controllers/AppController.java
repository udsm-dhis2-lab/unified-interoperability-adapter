package com.Adapter.icare.apps.controllers;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import io.swagger.v3.oas.annotations.tags.Tag;

import java.nio.file.attribute.BasicFileAttributes;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/apps")
@Tag(name = "Apps Management", description = "APIs for managing application deployments")
public class AppController {
    @Value("${spring.web.resources.static-locations:classpath:/static/}")
    private String staticResourceLocation;

    private String getUploadDir() {
        try {
            Resource resource = new ClassPathResource("static");
            return resource.getFile().getAbsolutePath() + File.separator;
        } catch (IOException e) {
            throw new RuntimeException("Failed to resolve static directory", e);
        }
    }

    @PostMapping()
    public String uploadAndExtract(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return "File is empty";
        }

        try {
            String uploadDir = getUploadDir();
            String appName = file.getOriginalFilename().replace(".zip", "");
            String appDir = uploadDir + appName;

            // Delete existing app directory if it exists
            if (Files.exists(Paths.get(appDir))) {
                Files.walk(Paths.get(appDir))
                        .sorted(Comparator.reverseOrder())
                        .map(Path::toFile)
                        .forEach(File::delete);
            }

            // Ensure directories exist
            Files.createDirectories(Paths.get(appDir));

            // Save the zip file temporarily
            String zipFilePath = uploadDir + file.getOriginalFilename();
            Files.write(Paths.get(zipFilePath), file.getBytes());

            // Extract ZIP file
            unzip(zipFilePath, appDir); // Changed from uploadDir to appDir

            // Delete the ZIP file after extraction
            Files.delete(Paths.get(zipFilePath));

            return String.format("App '%s' uploaded and extracted successfully!", appName);
        } catch (IOException e) {
            return "Error processing file: " + e.getMessage();
        }
    }

    private void unzip(String zipFilePath, String destDir) throws IOException {
        try (ZipInputStream zis = new ZipInputStream(new FileInputStream(zipFilePath))) {
            ZipEntry zipEntry;
            while ((zipEntry = zis.getNextEntry()) != null) {
                File newFile = new File(destDir, zipEntry.getName());

                new File(newFile.getParent()).mkdirs();

                if (!zipEntry.isDirectory()) {
                    try (FileOutputStream fos = new FileOutputStream(newFile)) {
                        byte[] buffer = new byte[1024];
                        int len;
                        while ((len = zis.read(buffer)) > 0) {
                            fos.write(buffer, 0, len);
                        }
                    }
                }
                zis.closeEntry();
            }
        }
    }

    @GetMapping()
    public List<Map<String, Object>> listApps() {
        try {
            String uploadDir = getUploadDir();
            return Files.list(Paths.get(uploadDir))
                    .filter(Files::isDirectory)
                    .map(path -> {
                        Map<String, Object> appInfo = new HashMap<>();
                        appInfo.put("name", path.getFileName().toString());
                        appInfo.put("dir", uploadDir);
                        try {
                            BasicFileAttributes attrs = Files.readAttributes(path, BasicFileAttributes.class);
                            appInfo.put("createdAt", attrs.creationTime().toInstant());
                            appInfo.put("lastModified", attrs.lastModifiedTime().toInstant());
                        } catch (IOException e) {
                            appInfo.put("createdAt", null);
                            appInfo.put("lastModified", null);
                        }
                        return appInfo;
                    })
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new RuntimeException("Error listing apps: " + e.getMessage());
        }
    }
}
