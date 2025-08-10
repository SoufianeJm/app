package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    
    private boolean success;
    private String message;
    private T data;
    private Object meta;
    private LocalDateTime timestamp;
    
    // Success response with data
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, message, data, null, LocalDateTime.now());
    }
    
    // Success response with data and meta
    public static <T> ApiResponse<T> success(T data, String message, Object meta) {
        return new ApiResponse<>(true, message, data, meta, LocalDateTime.now());
    }
    
    // Success response without data
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message, null, null, LocalDateTime.now());
    }
    
    // Error response
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null, null, LocalDateTime.now());
    }
    
    // Error response with data
    public static <T> ApiResponse<T> error(String message, T data) {
        return new ApiResponse<>(false, message, data, null, LocalDateTime.now());
    }
}
