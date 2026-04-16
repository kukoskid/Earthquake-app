package com.example.earthquakeapp.repository;

import com.example.earthquakeapp.model.Earthquake;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EarthquakeRepository extends JpaRepository<Earthquake, Long> {

    List<Earthquake> findByMagnitudeGreaterThanEqual(Double magnitude);

    List<Earthquake> findByTimeGreaterThanEqual(Long time);

    @Query("""
        SELECT e FROM Earthquake e
        WHERE (:minMagnitude IS NULL OR e.magnitude >= :minMagnitude)
          AND (:afterTime IS NULL OR e.time >= :afterTime)
          AND (:place IS NULL OR :place = '' OR LOWER(e.place) LIKE LOWER(CONCAT('%', :place, '%')))
    """)
    List<Earthquake> filterEarthquakes(
            @Param("minMagnitude") Double minMagnitude,
            @Param("afterTime") Long afterTime,
            @Param("place") String place
    );

    @Modifying
    @Transactional
    @Query(value = "TRUNCATE TABLE earthquakes RESTART IDENTITY", nativeQuery = true)
    void truncateAndResetIdentity();
}