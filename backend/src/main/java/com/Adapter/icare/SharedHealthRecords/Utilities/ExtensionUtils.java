package com.Adapter.icare.SharedHealthRecords.Utilities;

import org.hl7.fhir.r4.model.*;

import java.math.BigDecimal;
import java.util.Date;

public class ExtensionUtils {
    public static  String getNestedExtensionValueString(DomainResource resource, String parentUrl, String childUrl) {
        if (resource.hasExtension()) {
            for (Extension parentExtension : resource.getExtension()) {
                if (parentExtension.getUrl().equals(parentUrl) && parentExtension.hasExtension()) {
                    for (Extension childExtension : parentExtension.getExtension()) {
                        if (childExtension.getUrl().equals(childUrl)
                                && childExtension.hasValue()
                                && childExtension.getValue() instanceof StringType) {
                            return ((StringType) childExtension.getValue()).getValue();
                        }
                    }
                }
            }
        }
        return null;
    }

    public static  Integer getNestedExtensionValueInteger(DomainResource resource, String parentUrl, String childUrl) {
        if (resource.hasExtension()) {
            for (Extension parentExtension : resource.getExtension()) {
                if (parentExtension.getUrl().equals(parentUrl) && parentExtension.hasExtension()) {
                    for (Extension childExtension : parentExtension.getExtension()) {
                        if (childExtension.getUrl().equals(childUrl)
                                && childExtension.hasValue()
                                && childExtension.getValue() instanceof IntegerType) {
                            return ((IntegerType) childExtension.getValue()).getValue();
                        }
                    }
                }
            }
        }
        return null;
    }

    public static  Date getNestedExtensionValueDateTime(DomainResource resource, String parentUrl, String childUrl) {
        if (resource.hasExtension()) {
            for (Extension parentExtension : resource.getExtension()) {
                if (parentExtension.getUrl().equals(parentUrl) && parentExtension.hasExtension()) {
                    for (Extension childExtension : parentExtension.getExtension()) {
                        if (childExtension.getUrl().equals(childUrl)
                                && childExtension.hasValue()
                                && childExtension.getValue() instanceof DateTimeType) {
                            return ((DateTimeType) childExtension.getValue()).getValue();
                        }
                    }
                }
            }
        }
        return null;
    }

    public static  Boolean getNestedExtensionValueBoolean(DomainResource resource, String parentUrl, String childUrl) {
        if (resource.hasExtension()) {
            for (Extension parentExtension : resource.getExtension()) {
                if (parentExtension.getUrl().equals(parentUrl) && parentExtension.hasExtension()) {
                    for (Extension childExtension : parentExtension.getExtension()) {
                        if (childExtension.getUrl().equals(childUrl)
                                && childExtension.hasValue()
                                && childExtension.getValue() instanceof BooleanType) {
                            return ((BooleanType) childExtension.getValue()).getValue();
                        }
                    }
                }
            }
        }
        return null;
    }

    public static  Boolean getExtensionValueBoolean(DomainResource resource, String url) {
        if (resource.hasExtension()) {
            for (Extension parentExtension : resource.getExtension()) {
                if (parentExtension.getUrl().equals(url) && parentExtension.hasValue()
                        && parentExtension.getValue() instanceof BooleanType) {
                    return ((BooleanType) parentExtension.getValue()).getValue();
                }
            }
        }
        return null;
    }

    public static  String getExtensionValueString(DomainResource resource, String url) {
        if (resource.hasExtension()) {
            for (Extension parentExtension : resource.getExtension()) {
                if (parentExtension.getUrl().equals(url) && parentExtension.hasValue()
                        && parentExtension.getValue() instanceof StringType) {
                    return ((StringType) parentExtension.getValue()).getValue();
                }
            }
        }
        return null;
    }

    public static  Integer getExtensionValueInt(DomainResource resource, String url) {
        if (resource.hasExtension()) {
            for (Extension parentExtension : resource.getExtension()) {
                if (parentExtension.getUrl().equals(url) && parentExtension.hasValue()
                        && parentExtension.getValue() instanceof IntegerType) {
                    return ((IntegerType) parentExtension.getValue()).getValue();
                }
            }
        }
        return null;
    }

    public static  BigDecimal getNestedExtensionValueQuantityValue(Procedure procedure, String parentUrl,
                                                            String childUrl) {
        if (procedure.hasExtension()) {
            for (Extension parentExtension : procedure.getExtension()) {
                if (parentExtension.getUrl().equals(parentUrl) && parentExtension.hasExtension()) {
                    for (Extension childExtension : parentExtension.getExtension()) {
                        if (childExtension.getUrl().equals(childUrl)
                                && childExtension.hasValue()
                                && childExtension.getValue() instanceof Quantity) {
                            return ((Quantity) childExtension.getValue()).getValue();
                        }
                    }
                }
            }
        }
        return null;
    }
}
