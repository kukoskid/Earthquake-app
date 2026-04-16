package com.example.earthquakeapp.service;

import com.example.earthquakeapp.dto.FeatureDto;
import com.example.earthquakeapp.dto.UsgsResponseDto;
import com.example.earthquakeapp.exception.ResourceNotFoundException;
import com.example.earthquakeapp.model.Earthquake;
import com.example.earthquakeapp.repository.EarthquakeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EarthquakeService {

    private final UsgsClientService usgsClientService;
    private final EarthquakeRepository earthquakeRepository;

    public List<Earthquake> fetchFilterAndStore(Double minMagnitude, Long afterTime) {
        UsgsResponseDto response = usgsClientService.fetchLatestEarthquakes();

        if (response == null || response.getFeatures() == null) {
            throw new RuntimeException("No data received from USGS API");
        }

        List<Earthquake> earthquakes = new ArrayList<>();

        for (FeatureDto feature : response.getFeatures()) {
            if (feature == null || feature.getProperties() == null) {
                continue;
            }

            Double mag = feature.getProperties().getMag();
            Long time = feature.getProperties().getTime();

            if (mag == null || time == null) {
                continue;
            }

            if (mag >= minMagnitude && time >= afterTime) {
                Double longitude = null;
                Double latitude = null;

                if (feature.getGeometry() != null &&
                        feature.getGeometry().getCoordinates() != null &&
                        feature.getGeometry().getCoordinates().size() >= 2) {
                    longitude = feature.getGeometry().getCoordinates().get(0);
                    latitude = feature.getGeometry().getCoordinates().get(1);
                }

                Earthquake earthquake = Earthquake.builder()
                        .externalId(feature.getId())
                        .magnitude(mag)
                        .magType(feature.getProperties().getMagType())
                        .place(feature.getProperties().getPlace())
                        .title(feature.getProperties().getTitle())
                        .time(time)
                        .longitude(longitude)
                        .latitude(latitude)
                        .build();

                earthquakes.add(earthquake);
            }
        }

        earthquakeRepository.truncateAndResetIdentity();
        return earthquakeRepository.saveAll(earthquakes);
    }

    public List<Earthquake> getAllEarthquakes() {
        return earthquakeRepository.findAll();
    }

    public List<Earthquake> getEarthquakesByMagnitude(Double minMagnitude) {
        return earthquakeRepository.findByMagnitudeGreaterThanEqual(minMagnitude);
    }

    public List<Earthquake> getEarthquakesAfterTime(Long time) {
        return earthquakeRepository.findByTimeGreaterThanEqual(time);
    }

    public List<Earthquake> filterEarthquakes(Double minMagnitude, Long afterTime, String place) {
        return earthquakeRepository.filterEarthquakes(minMagnitude, afterTime, place);
    }

    public void deleteById(Long id) {
        if (!earthquakeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Earthquake with id " + id + " not found");
        }
        earthquakeRepository.deleteById(id);
    }
}