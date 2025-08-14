package com.Adapter.icare.CustomExceptions;

public class InvalidDateFormatException extends  RuntimeException {
    public InvalidDateFormatException(String message) {
        super(message);
    }
}
