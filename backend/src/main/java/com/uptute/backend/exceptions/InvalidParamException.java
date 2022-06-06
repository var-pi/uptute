package com.uptute.backend.exceptions;

public class InvalidParamException extends Exception {
    public InvalidParamException(String message){
        super(message);
    }
}