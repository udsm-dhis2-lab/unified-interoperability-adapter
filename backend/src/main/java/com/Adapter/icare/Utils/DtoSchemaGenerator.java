package com.Adapter.icare.Utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Generates a detailed, flattened JSON schema for a given DTO class.
 * Properties of objects within collections are represented with full paths using '[]' notation.
 */
public class DtoSchemaGenerator {

    private static final ObjectMapper objectMapper = new ObjectMapper()
            .enable(SerializationFeature.INDENT_OUTPUT);

    public void generateAndSaveSchema(Class<?> dtoClass, Path outputPath) throws IOException {
        List<Map<String, Object>> schema = generateSchemaForClass(dtoClass, "");
        String schemaJson = objectMapper.writeValueAsString(schema);
        Files.writeString(outputPath, schemaJson);
        System.out.println("Successfully generated and saved robust schema to: " + outputPath.toAbsolutePath());
    }

    private List<Map<String, Object>> generateSchemaForClass(Class<?> clazz, String prefix) {
        List<Map<String, Object>> schemaList = new ArrayList<>();

        for (Field field : getAllFields(clazz)) {
            if (Modifier.isStatic(field.getModifiers())) continue;

            String fieldName = field.getName();
            Class<?> fieldType = field.getType();
            String currentPath = prefix.isEmpty() ? fieldName : prefix + "." + fieldName;

            if (isSimpleType(fieldType)) {
                Map<String, Object> fieldSchema = new LinkedHashMap<>();
                fieldSchema.put("path", currentPath);
                fieldSchema.put("label", toHumanReadable(fieldName));
                fieldSchema.put("type", getSimpleTypeName(fieldType));
                if (fieldType.isEnum()) {
                    fieldSchema.put("options", getEnumConstants(fieldType));
                }
                schemaList.add(fieldSchema);

            } else if (Collection.class.isAssignableFrom(fieldType)) {
                Type genericArgumentType = getCollectionGenericArgumentType(field);
                String collectionItemPrefix = currentPath + "[].";

                if (genericArgumentType instanceof Class) {
                    Class<?> itemClass = (Class<?>) genericArgumentType;
                    if (isSimpleType(itemClass)) {
                        Map<String, Object> itemSchema = new LinkedHashMap<>();
                        itemSchema.put("path", currentPath + "[]");
                        itemSchema.put("label", toHumanReadable(fieldName) + " (Item)");
                        itemSchema.put("type", getSimpleTypeName(itemClass));
                        schemaList.add(itemSchema);
                    } else {
                        schemaList.addAll(generateSchemaForClass(itemClass, collectionItemPrefix));
                    }
                } else if (genericArgumentType instanceof ParameterizedType) {
                    Map<String, Object> itemSchema = new LinkedHashMap<>();
                    itemSchema.put("path", currentPath + "[]");
                    itemSchema.put("label", toHumanReadable(fieldName) + " (Item)");
                    itemSchema.put("type", "GENERIC_OBJECT");
                    schemaList.add(itemSchema);
                }

            } else if (Map.class.isAssignableFrom(fieldType)) {
                Map<String, Object> fieldSchema = new LinkedHashMap<>();
                fieldSchema.put("path", currentPath);
                fieldSchema.put("label", toHumanReadable(fieldName));
                fieldSchema.put("type", "MAP_OBJECT");
                schemaList.add(fieldSchema);

            } else {
                schemaList.addAll(generateSchemaForClass(fieldType, currentPath));
            }
        }
        return schemaList;
    }

    private Type getCollectionGenericArgumentType(Field field) {
        Type genericType = field.getGenericType();
        if (genericType instanceof ParameterizedType) {
            Type[] typeArguments = ((ParameterizedType) genericType).getActualTypeArguments();
            if (typeArguments.length > 0) {
                return typeArguments[0];
            }
        }
        return null;
    }


    private String getSimpleTypeName(Class<?> fieldType) {
        if (fieldType.isEnum()) return "ENUM";
        if (Boolean.class.equals(fieldType) || boolean.class.equals(fieldType)) return "BOOLEAN";
        if (Number.class.isAssignableFrom(fieldType) || (fieldType.isPrimitive() && !boolean.class.equals(fieldType))) return "NUMBER";
        return "STRING";
    }

    private List<Field> getAllFields(Class<?> clazz) {
        List<Field> fields = new ArrayList<>();
        for (Class<?> c = clazz; c != null && c != Object.class; c = c.getSuperclass()) {
            fields.addAll(Arrays.asList(c.getDeclaredFields()));
        }
        return fields;
    }

    private String toHumanReadable(String camelCase) {
        if (camelCase == null || camelCase.isEmpty()) return "";
        String readable = camelCase.replaceAll("(?<=[a-z])(?=[A-Z])", " ");
        return Character.toUpperCase(readable.charAt(0)) + readable.substring(1);
    }

    private List<String> getEnumConstants(Class<?> enumClass) {
        return Arrays.stream(enumClass.getEnumConstants()).map(Object::toString).collect(Collectors.toList());
    }

    private boolean isSimpleType(Class<?> clazz) {
        return clazz.isPrimitive() || clazz.isEnum() || String.class.isAssignableFrom(clazz) ||
                Number.class.isAssignableFrom(clazz) || Boolean.class.isAssignableFrom(clazz) ||
                Date.class.isAssignableFrom(clazz);
    }

    private Class<?> getCollectionGenericType(Field field) {
        Type genericType = field.getGenericType();
        if (genericType instanceof ParameterizedType) {
            return (Class<?>) ((ParameterizedType) genericType).getActualTypeArguments()[0];
        }
        return null;
    }
}