package com.example.earthquakeapp.controller;

import com.example.earthquakeapp.model.Earthquake;
import com.example.earthquakeapp.service.EarthquakeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/earthquakes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class EarthquakeController {

    private final EarthquakeService earthquakeService;

    @PostMapping("/fetch")
    public List<Earthquake> fetchAndStore(
            @RequestParam(defaultValue = "2.0") Double minMagnitude,
            @RequestParam(required = false) Long afterTime
    ) {
        if (afterTime == null) {
            afterTime = Instant.now().minusSeconds(24 * 60 * 60).toEpochMilli();
        }

        return earthquakeService.fetchFilterAndStore(minMagnitude, afterTime);
    }

    @GetMapping
    public List<Earthquake> getAll() {
        return earthquakeService.getAllEarthquakes();
    }

    @GetMapping("/filter/magnitude")
    public List<Earthquake> getByMagnitude(@RequestParam Double minMagnitude) {
        return earthquakeService.getEarthquakesByMagnitude(minMagnitude);
    }

    @GetMapping("/filter/time")
    public List<Earthquake> getByTime(@RequestParam Long afterTime) {
        return earthquakeService.getEarthquakesAfterTime(afterTime);
    }

    @GetMapping("/filter/combined")
    public List<Earthquake> filterCombined(
            @RequestParam(required = false) Double minMagnitude,
            @RequestParam(required = false) Long afterTime,
            @RequestParam(required = false) String place
    ) {
        return earthquakeService.filterEarthquakes(minMagnitude, afterTime, place);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        earthquakeService.deleteById(id);
    }
}