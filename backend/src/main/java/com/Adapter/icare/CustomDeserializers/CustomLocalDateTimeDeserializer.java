package com.Adapter.icare.CustomDeserializers;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class CustomLocalDateTimeDeserializer extends JsonDeserializer<LocalDateTime> {
    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public LocalDateTime deserialize(JsonParser p, DeserializationContext ctxt)
            throws IOException {
        String date = p.getText();

        if (date == null || date.trim().isEmpty()) {
            return null;
        }

        String cleanedDate = date.contains("T") ? date.replace("T", " ").trim() : date.trim();

        if (cleanedDate.length() > 19) {
            cleanedDate = cleanedDate.substring(0, 19);
        }

        if(!cleanedDate.contains(" ")) {
            cleanedDate = cleanedDate + " 00:00:00";
        }

        try {
            return LocalDateTime.parse(cleanedDate, FORMATTER);
        } catch (Exception e) {
            System.err.println("Failed to parse date: [" + date + "]");
            throw e;
        }
    }

}