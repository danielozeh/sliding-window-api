class SlidingWindowCounter {
    constructor(windowSizeInSeconds) {
        this.windowSize = windowSizeInSeconds;
        this.buckets = new Array(windowSizeInSeconds).fill(0);
        this.currentTime = Math.floor(Date.now() / 1000);
    }

    // Record an event at a specific timestamp
    recordEvent(timestamp) {
        const eventTime = Math.floor(timestamp / 1000);
        this._advanceTime(eventTime);
        const index = eventTime % this.windowSize;
        this.buckets[index] += 1;
    }

    // Get the count of events in the sliding window
    getEventCount() {
        return this.buckets.reduce((sum, count) => sum + count, 0);
    }

    // Update the window by clearing old buckets
    _advanceTime(eventTime) {
        const currentTime = Math.floor(Date.now() / 1000);
        const timeDiff = currentTime - this.currentTime;

        if (timeDiff >= this.windowSize) {
            this.buckets.fill(0);
        } else if (timeDiff > 0) {
            for (let i = 1; i <= timeDiff; i++) {
                const index = (this.currentTime + i) % this.windowSize;
                this.buckets[index] = 0;
            }
        }
        this.currentTime = currentTime;
    }
}

export default SlidingWindowCounter;
