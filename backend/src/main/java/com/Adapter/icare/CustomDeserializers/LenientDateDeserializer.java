package com.Adapter.icare.CustomDeserializers;

import com.Adapter.icare.CustomExceptions.InvalidDateFormatException;
import com.Adapter.icare.validators.annotations.JsonLenientDateFormat;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.BeanProperty;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.deser.ContextualDeserializer;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class LenientDateDeserializer extends JsonDeserializer<Date> implements ContextualDeserializer {

    private final String pattern;

    /**
     * Default constructor for Jackson.
     * The pattern will be null here and will be set by createContextual.
     */
    public LenientDateDeserializer() {
        this.pattern = null;
    }

    /**
     * Overloaded constructor to create a new instance with a specific pattern.
     * This is called by createContextual.
     */
    public LenientDateDeserializer(String pattern) {
        this.pattern = pattern;
    }

    @Override
    public JsonDeserializer<?> createContextual(DeserializationContext ctxt, BeanProperty property) throws JsonMappingException {
        JsonLenientDateFormat ann = property.getAnnotation(JsonLenientDateFormat.class);

        if (ann != null) {
            String patternFromAnnotation = ann.pattern();
            return new LenientDateDeserializer(patternFromAnnotation);
        }

        return this;
    }

    @Override
    public Date deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String text = p.getText();
        if (text == null || "null".equalsIgnoreCase(text.trim())) {
            return null;
        }

        if (this.pattern == null) {
            throw new IOException("Date pattern has not been configured for LenientDateDeserializer.");
        }

        SimpleDateFormat formatter = new SimpleDateFormat(this.pattern);

        try {
            return formatter.parse(text);
        } catch (ParseException e) {
            throw new InvalidDateFormatException(
                    "Failed to parse date '" + text + "' with pattern '" + this.pattern + "'");
        }
    }
}
