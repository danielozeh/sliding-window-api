const express = require('express');
const app = express();
const port = 3000;

// SlidingWindowCounter class
class SlidingWindowCounter {
  constructor(windowSizeInSeconds) {
    this.windowSizeInSeconds = windowSizeInSeconds;
    this.buckets = new Array(windowSizeInSeconds).fill(0);  // Circular buffer for time buckets
    this.currentBucketIndex = 0;
    this.totalEvents = 0;
    this.lastTimestamp = Math.floor(Date.now() / 1000);
  }

  // Record an event happening at the current time
  recordEvent() {
    const now = Math.floor(Date.now() / 1000);
    this._advanceTime(now);

    this.buckets[this.currentBucketIndex]++;
    this.totalEvents++;
  }

  // Get the total number of events in the current window
  getEventCount() {
    const now = Math.floor(Date.now() / 1000);
    this._advanceTime(now);
    return this.totalEvents;
  }

  // Advance the circular buffer based on the current time
  _advanceTime(now) {
    const timePassed = now - this.lastTimestamp;
    if (timePassed > 0) {
      for (let i = 0; i < Math.min(timePassed, this.windowSizeInSeconds); i++) {
        this.currentBucketIndex = (this.currentBucketIndex + 1) % this.windowSizeInSeconds;
        this.totalEvents -= this.buckets[this.currentBucketIndex]; // Subtract expired events
        this.buckets[this.currentBucketIndex] = 0; // Clear expired bucket
      }
      this.lastTimestamp = now;
    }
  }
}

// Initialize the sliding window counter with a 5-minute window (300 seconds)
const slidingWindow = new SlidingWindowCounter(300);

// Middleware to parse JSON request body
app.use(express.json());

// POST /event - To record a new event
app.post('/event', (req, res) => {
  slidingWindow.recordEvent();
  res.status(201).send({ message: 'Event recorded' });
});

// GET /events/count - To get the count of events in the last 5 minutes
app.get('/events/count', (req, res) => {
  const eventCount = slidingWindow.getEventCount();
  res.status(200).send({ eventCount });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
