package com.Adapter.icare.Utils;

import java.lang.reflect.Method;
import java.util.Optional;

public class DTONavigator {
    /**
     * Dynamically gets a value from a nested DTO using a string path like "name.first".
     *
     * @param rootObject The starting object (e.g., an instance of Person).
     * @param path       The dot-separated path to the desired value.
     * @return An Optional containing the value if found, or an empty Optional otherwise.
     */
    public static Optional<Object> getValueByPath(Object rootObject, String path) {
        if (rootObject == null || path == null || path.isEmpty()) {
            return Optional.empty();
        }

        Object currentObject = rootObject;
        String[] keys = path.split("\\.");

        for (String key : keys) {
            if (currentObject == null) {
                return Optional.empty();
            }
            currentObject = invokeGetter(currentObject, key);
        }

        return Optional.ofNullable(currentObject);
    }

    /**
     * Helper to find and invoke a getter method for a given property name.
     */
    private static Object invokeGetter(Object obj, String propertyName) {
        try {
            String methodName = "get" + propertyName.substring(0, 1).toUpperCase() + propertyName.substring(1);
            Method getter = obj.getClass().getMethod(methodName);
            return getter.invoke(obj);
        } catch (Exception e) {
            System.err.println("Could not resolve property '" + propertyName + "' on object " + obj.getClass().getSimpleName());
            return null;
        }
    }
}
