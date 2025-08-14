package com.Adapter.icare.validators.annotations;

import com.Adapter.icare.CustomDeserializers.LenientDateDeserializer;
import com.fasterxml.jackson.annotation.JacksonAnnotationsInside;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * A custom meta-annotation that combines our lenient date deserializer
 * with a configurable date pattern.
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
@JacksonAnnotationsInside
@JsonDeserialize(using = LenientDateDeserializer.class)
public @interface JsonLenientDateFormat {

    String pattern() default "yyyy-MM-dd";
}
