package com.example.earthquakeapp.dto;

import lombok.Data;
import java.util.List;

@Data
public class GeometryDto {
    private List<Double> coordinates;
}