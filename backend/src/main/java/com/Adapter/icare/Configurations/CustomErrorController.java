package com.Adapter.icare.Configurations;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.RequestMapping;

@ControllerAdvice
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public String handleError() {
        System.out.println("ERROR Handling");
        // Custom error handling logic
        return "error"; // View name or path to your error page
    }

    public String getErrorPath() {
        System.out.println("ERROR Handling");
        return "/error";
    }
}
