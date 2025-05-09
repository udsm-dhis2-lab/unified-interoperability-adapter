package com.Adapter.icare.storage.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.Adapter.icare.storage.services.FileStorageService;
import com.Adapter.icare.storage.services.FhirResourceService;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/files")
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private FhirResourceService fhirResourceService;

    @PostMapping("/{id}/uploads")
    public ResponseEntity<Map<String, Object>> uploadFile(@PathVariable String id,
            @RequestParam("file") MultipartFile file) {
        try {
            String fileName = fileStorageService.storeFile(file, id);

            String justFileName = fileName;
            if (fileName.contains("/")) {
                justFileName = fileName.substring(fileName.lastIndexOf("/") + 1);
            }

            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/v1/files/")
                    .path(justFileName)
                    .path("/downloads")
                    .queryParam("id", id)
                    .toUriString();

             fhirResourceService.createAndSubmitImagingStudyResource(
                    id, justFileName, file.getOriginalFilename(), file.getContentType(),
                    justFileName);

            Map<String, Object> response = new HashMap<>();
            response.put("fileName", justFileName);
            response.put("fileDownloadUri", fileDownloadUri);
            response.put("fileType", file.getContentType());
            response.put("size", String.valueOf(file.getSize()));
            response.put("id", id);

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{fileName}/downloads")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName,
            @RequestParam(required = true) String id,
            HttpServletRequest request) {
        try {
            if (id == null || id.isEmpty()) {
                throw new IllegalArgumentException("HCR code is required");
            }
            Resource resource = fileStorageService.loadFileAsResource(id + "/" + fileName);

            String contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());

            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{fileName:.+}")
    public ResponseEntity<Map<String, String>> deleteFile(@PathVariable String fileName,
            @RequestParam(required = true) String id) {
        Map<String, String> response = new HashMap<>();
        if (id == null || id.isEmpty()) {
            throw new IllegalArgumentException("HCR code is required");
        }
        try {
            fileStorageService.deleteFile(id + "/" + fileName);
            response.put("message", "File deleted successfully");
            response.put("id", id);
            response.put("fileName", fileName);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}