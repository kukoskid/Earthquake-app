package com.example.earthquakeapp.dto;

import lombok.Data;
import java.util.List;

@Data
public class UsgsResponseDto {
    private List<FeatureDto> features;
}