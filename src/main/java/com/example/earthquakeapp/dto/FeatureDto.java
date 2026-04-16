package com.example.earthquakeapp.dto;

import lombok.Data;

@Data
public class FeatureDto {
    private String id;
    private PropertiesDto properties;
    private GeometryDto geometry;
}