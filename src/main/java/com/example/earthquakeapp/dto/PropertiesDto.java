package com.example.earthquakeapp.dto;

import lombok.Data;

@Data
public class PropertiesDto {
    private Double mag;
    private String magType;
    private String place;
    private String title;
    private Long time;
}