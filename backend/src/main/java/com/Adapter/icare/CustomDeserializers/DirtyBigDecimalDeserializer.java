package com.Adapter.icare.CustomDeserializers;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class DirtyBigDecimalDeserializer extends JsonDeserializer<BigDecimal> {
    private static final Pattern NUMBER_PATTERN = Pattern.compile("(-?\\d+(\\.\\d+)?)");

    private static final BigDecimal MIN_COORD = new BigDecimal("-180");
    private static final BigDecimal MAX_COORD = new BigDecimal("180");

    @Override
    public BigDecimal deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getText();

        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        BigDecimal result = null;;
        try {
            String clean = value.replace("_", "").trim();

            try {
                result = new BigDecimal(clean);
            } catch (NumberFormatException e) {
                Matcher matcher = NUMBER_PATTERN.matcher(clean);
                if (matcher.find()) {
                    result = new BigDecimal(matcher.group(1));
                }
            }
        } catch (Exception e) {}

        if (result != null) {
            if (result.compareTo(MIN_COORD) < 0 || result.compareTo(MAX_COORD) > 0) {
                System.err.println("Warning: Coordinate out of bounds (Skipping): " + value + " -> parsed as " + result);
                return null;
            }
        } else {
            System.err.println("Warning: Could not parse coordinate: " + value);
        }

        return result;
    }
}