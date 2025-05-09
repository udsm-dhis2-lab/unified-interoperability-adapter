package com.Adapter.icare.Utils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Date;
import java.util.Objects;

public class DateUtils {

    /**
     * Parses a date string into a java.util.Date using the specified format.
     * Assumes the string represents only a date (no time).
     * Returns null if the string is null, blank, or cannot be parsed.
     *
     * @param dateString The string to parse (e.g., "2023-10-27").
     * @param formatPattern The pattern matching the dateString (e.g., "yyyy-MM-dd").
     * @return A java.util.Date object or null if parsing fails.
     */
    public static Date stringToDateOrNull(String dateString, String formatPattern) {
        if (dateString == null || dateString.isBlank() ||
                formatPattern == null || formatPattern.isBlank()) {
            return null;
        }
        Objects.requireNonNull(formatPattern, "formatPattern cannot be null");

        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(formatPattern);
            LocalDate localDate = LocalDate.parse(dateString, formatter);

            return Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());

        } catch (DateTimeParseException e) {
            // Log the error if needed: e.g., log.warn("Failed to parse date string '{}' with format '{}'", dateString, formatPattern, e);
            System.err.println("Parsing failed for '" + dateString + "' with format '" + formatPattern + "': " + e.getMessage());
            return null;
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid format pattern '" + formatPattern + "': " + e.getMessage());
            return null;
        } catch (Exception e) {
            // Catch any other unexpected errors during parsing/conversion
            System.err.println("Unexpected error parsing date: " + e.getMessage());
            return null;
        }
    }

    /**
     * Parses a date-time string into a java.util.Date using the specified format.
     * Assumes the string represents both date and time.
     * Returns null if the string is null, blank, or cannot be parsed.
     *
     * @param dateTimeString The string to parse (e.g., "2023-10-27 15:30:00").
     * @param formatPattern The pattern matching the dateTimeString (e.g., "yyyy-MM-dd HH:mm:ss").
     * @return A java.util.Date object or null if parsing fails.
     */
    public static Date stringToDateTimeOrNull(String dateTimeString, String formatPattern) {
        if (dateTimeString == null || dateTimeString.isBlank() ||
                formatPattern == null || formatPattern.isBlank()) {
            return null;
        }
        Objects.requireNonNull(formatPattern, "formatPattern cannot be null");

        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(formatPattern);
            LocalDateTime localDateTime = LocalDateTime.parse(dateTimeString, formatter);

            return Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());

        } catch (DateTimeParseException e) {
            System.err.println("Parsing failed for '" + dateTimeString + "' with format '" + formatPattern + "': " + e.getMessage());
            return null;
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid format pattern '" + formatPattern + "': " + e.getMessage());
            return null;
        } catch (Exception e) {
            // Catch any other unexpected errors during parsing/conversion
            System.err.println("Unexpected error parsing date/time: " + e.getMessage());
            return null;
        }
    }
}