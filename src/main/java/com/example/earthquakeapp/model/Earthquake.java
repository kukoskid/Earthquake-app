package com.example.earthquakeapp.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "earthquakes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Earthquake {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String externalId;

    private Double magnitude;

    private String magType;

    private String place;

    private String title;

    private Long time;

    private Double latitude;

    private Double longitude;
}