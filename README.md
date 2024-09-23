# Sliding Window Event Counter API

This project implements a simple API-driven event counter that tracks the number of events in a sliding window (e.g., within the last 5 minutes). The system can handle high-throughput events while maintaining constant memory usage and providing accurate event counts within a specified time window.

## Features
- Track events in a sliding window (e.g., 5 minutes).
- Efficient memory usage with a circular buffer.
- REST API to record events and query the event count.
- Scalable to handle high event volumes.

## Prerequisites
- Node.js (>= v12)
- npm (comes with Node.js)

## Project Setup
Clone the repository:

```
git clone https://github.com/danielozeh/sliding-window-api.git
cd sliding-window-api
```

Install dependencies:

```
npm install
```

Start the server:

```
npm run start
```

The server will be running at http://localhost:3000.

### API Endpoints

#### 1. Record an Event

Endpoint: POST /event

#### Description
Records an event at the current timestamp.

#### Example Request

```
curl -X POST http://localhost:3000/event
```

#### Response

```
json
{
  "message": "Event recorded"
}
```

#### 2. Get Event Count in the Last 5 Minutes

Endpoint: GET /events/count

#### Description
Returns the count of events recorded in the last 5 minutes.

#### Example Request

```
curl http://localhost:3000/events/count
```

#### Response

```
json
{
  "eventCount": 42
}
```

#### Project Structure

```
.
├── app.js        # Main application file containing the API and Sliding Window logic
├── package.json  # NPM dependencies and scripts
└── README.md     # Project documentation
```

#### How it Works
The sliding window logic is implemented in the SlidingWindowCounter class, which uses a fixed-size circular buffer to count events over the last 5 minutes (300 seconds).
Each bucket in the circular buffer tracks the number of events occurring within a specific second.
The system updates the buffer and removes expired event counts, ensuring constant memory usage regardless of the number of events.
#### How to Test
Record events by making a POST request to the /event endpoint.
Query the current event count in the sliding window using the /events/count endpoint.
Use tools like Postman or cURL to test the API.

#### Scripts

```
npm run start: Starts the Express server.
```

#### Further Development - Optional
- Implement additional endpoints for bulk event ingestion.
- Integrate with a message broker for distributed event processing.
- Add authentication for securing the API.

#### License
This project is licensed under the MIT License.