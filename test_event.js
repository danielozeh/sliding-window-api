import axios from 'axios';
import config from './config.js';

const PRODUCER_API_URL = `http://localhost:${config.port}/event`;
const EVENT_COUNT = 1000; // Number of events to publish

async function publishEvents() {
    console.log(`Publishing ${EVENT_COUNT} events to ${PRODUCER_API_URL}`);

    const promises = [];
    for (let i = 0; i < EVENT_COUNT; i++) {
        promises.push(axios.post(PRODUCER_API_URL).catch((err) => console.error(`Failed to send event ${i}`, err.response.status)));
    }

    // Wait for all events to be sent
    await Promise.all(promises);
    console.log(`Successfully published ${EVENT_COUNT} events.`);
}

// Run the script
publishEvents()
    .then(() => {
        console.log('Test completed.');
    })
    .catch((err) => {
        console.error('Error during test:', err);
    });
