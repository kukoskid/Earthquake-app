# Earthquake-app
#  Earthquake Tracker

A full-stack application for fetching, filtering, storing, and visualizing real-time earthquake data from the USGS GeoJSON feed.

The project consists of a Spring Boot backend (REST API) and a React frontend for displaying earthquake data in a user-friendly interface.

---

##  Features

- Fetch real-time earthquake data from USGS API
- Store and manage earthquake records in PostgreSQL
- Filter earthquakes by:
  - Minimum magnitude
  - Timestamp (epoch milliseconds)
- Delete individual earthquake records
- Interactive frontend dashboard
- Map visualization using Leaflet
- Clean and responsive UI
- Integration tests with H2 in-memory database

---

##  Tech Stack

### Backend
- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- PostgreSQL
- H2 (for testing)

### Frontend
- React (Vite)
- Axios
- Bootstrap
- Leaflet (for map visualization)

---

## 📁 Project Structure
earthquakeapp/
│
├── src/main/java/... # Backend source code
├── src/main/resources/... # Backend configuration
├── src/test/... # Backend tests (H2)
│
├── earthquake-frontend/ # React frontend
│
├── pom.xml
└── README.md

---

##  Project Setup Instructions

### Prerequisites

Make sure you have the following installed:

- Java 17
- Maven (or use `./mvnw`)
- Node.js and npm
- PostgreSQL (running locally)

---

##  How to Run the Application

1. Run Backend (Spring Boot)

From the root directory:


./mvnw spring-boot:run

Backend will be available at:
http://localhost:8080

2. Run Frontend (React)

In a separate terminal:
cd earthquake-frontend
npm install
npm start

Frontend will be available at:
http://localhost:5173

The frontend communicates with:
http://localhost:8080/api/earthquakes

## Database Configuration
The application uses PostgreSQL.
Step 1: Create database
CREATE DATABASE earthquakedb;
Step 2: Configure connection
Edit:
src/main/resources/application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/earthquakedb
spring.datasource.username=postgres
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
Update username/password if needed.

## API Endpoints

Base URL:
/api/earthquakes
Fetch latest earthquakes and store
POST /api/earthquakes/fetch

Get all earthquakes
GET /api/earthquakes

Filter by magnitude
GET /api/earthquakes/filter/magnitude?minMag=2.0
Filter by time

GET /api/earthquakes/filter/time?timestamp=1710000000000
Delete earthquake

DELETE /api/earthquakes/{id}

## Testing

The application includes integration tests for the service layer.
Uses H2 in-memory database
Uses Spring profile: test
External API calls are mocked for stability

Run tests:
./mvnw test

## Assumptions Made

Time is handled as epoch milliseconds (as provided by USGS)
Records missing critical fields (mag, time) are skipped
Optional fields (place, title, magType) default to "Unknown" if missing
Latitude and longitude may be null and are skipped in map rendering
To avoid duplicates, the application:
Deletes all existing records
Inserts freshly fetched data
Backend runs on port 8080, frontend on 3000
CORS is enabled for local development


## Optional Improvements Implemented

Delete endpoint for individual records
Map visualization using Leaflet
Improved UI styling and layout
Formatted timestamps for better readability
H2 database configuration for isolated testing
Clean layered architecture (Controller → Service → Repository)
