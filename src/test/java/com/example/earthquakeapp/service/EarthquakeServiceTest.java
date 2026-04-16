package com.example.earthquakeapp.service;

import com.example.earthquakeapp.dto.FeatureDto;
import com.example.earthquakeapp.dto.GeometryDto;
import com.example.earthquakeapp.dto.PropertiesDto;
import com.example.earthquakeapp.dto.UsgsResponseDto;
import com.example.earthquakeapp.model.Earthquake;
import com.example.earthquakeapp.repository.EarthquakeRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class EarthquakeServiceTest {

    @Autowired
    private EarthquakeService earthquakeService;

    @Autowired
    private EarthquakeRepository earthquakeRepository;

    @MockBean
    private UsgsClientService usgsClientService;

    @Test
    void shouldFetchFilterAndStoreEarthquakes() {
        PropertiesDto properties = new PropertiesDto();
        properties.setMag(3.5);
        properties.setMagType("mb");
        properties.setPlace("Test Location");
        properties.setTitle("Test Earthquake");
        properties.setTime(System.currentTimeMillis());

        GeometryDto geometry = new GeometryDto();
        geometry.setCoordinates(List.of(20.0, 40.0));

        FeatureDto feature = new FeatureDto();
        feature.setId("test-id-1");
        feature.setProperties(properties);
        feature.setGeometry(geometry);

        UsgsResponseDto mockResponse = new UsgsResponseDto();
        mockResponse.setFeatures(List.of(feature));

        when(usgsClientService.fetchLatestEarthquakes()).thenReturn(mockResponse);

        List<Earthquake> result = earthquakeService.fetchFilterAndStore(2.0, 0L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1, earthquakeRepository.findAll().size());

        Earthquake eq = result.get(0);
        assertEquals(3.5, eq.getMagnitude(), 0.001);
        assertEquals("mb", eq.getMagType());
        assertEquals("Test Location", eq.getPlace());
        assertEquals("Test Earthquake", eq.getTitle());
        assertEquals(20.0, eq.getLongitude(), 0.001);
        assertEquals(40.0, eq.getLatitude(), 0.001);
    }

    @Test
    void shouldFilterByMagnitude() {
        earthquakeRepository.save(
                Earthquake.builder().magnitude(1.0).time(100L).build()
        );
        earthquakeRepository.save(
                Earthquake.builder().magnitude(3.0).time(100L).build()
        );

        List<Earthquake> result = earthquakeService.getEarthquakesByMagnitude(2.0);

        assertEquals(1, result.size());
        assertTrue(result.get(0).getMagnitude() > 2.0);
    }

    @Test
    void shouldFilterByTime() {
        earthquakeRepository.save(
                Earthquake.builder().magnitude(3.0).time(100L).build()
        );
        earthquakeRepository.save(
                Earthquake.builder().magnitude(3.0).time(200L).build()
        );

        List<Earthquake> result = earthquakeService.getEarthquakesAfterTime(150L);

        assertEquals(1, result.size());
        assertTrue(result.get(0).getTime() > 150L);
    }
}