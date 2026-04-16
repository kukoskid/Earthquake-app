package com.example.earthquakeapp.service;

import com.example.earthquakeapp.dto.UsgsResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class UsgsClientService {

    @Value("${earthquake.feed.url}")
    private String usgsUrl;

    public UsgsResponseDto fetchLatestEarthquakes() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            UsgsResponseDto response = restTemplate.getForObject(usgsUrl, UsgsResponseDto.class);

            if (response == null) {
                throw new RuntimeException("USGS API returned empty response.");
            }

            return response;
        } catch (RestClientException e) {
            throw new RuntimeException("USGS API is unavailable or returned invalid data.");
        }
    }
}