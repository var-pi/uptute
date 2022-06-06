package com.uptute.backend.exceptions;

public class EmailIsAlreadyTakenException extends Exception{
    public EmailIsAlreadyTakenException(String email){
        super(email + " is already used!");
    }
}
