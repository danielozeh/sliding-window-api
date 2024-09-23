import express from 'express';
import amqp from 'amqplib';
import axios from 'axios';
import config from './config.js';

const app = express();
const CONSUMER_API_URL = `http://localhost:${config.consumerPort}/events/count`;

let channel, connection;

// Establish connection to RabbitMQ
async function connectToRabbitMQ() {
    try {
        connection = await amqp.connect(config.rabbitMQUrl);
        channel = await connection.createChannel();
        await channel.assertQueue('event_queue'); // Create queue if it doesn't exist
        console.log('Connected to RabbitMQ');
    } catch (err) {
        console.error('Failed to connect to RabbitMQ', err);
    }
}

// Publish event to RabbitMQ
function publishEvent() {
    const event = { timestamp: Date.now() };
    channel.sendToQueue('event_queue', Buffer.from(JSON.stringify(event)));
    console.log('Published event to queue:', event);
}

// API route to record an event
app.post('/event', (req, res) => {
    publishEvent();
    res.status(201).json({ message: 'Event recorded and published to queue' });
});

// API route to get the event count in the sliding window (last 5 minutes)
// This now queries the consumer's API
app.get('/events/count', async (req, res) => {
    try {
        const response = await axios.get(CONSUMER_API_URL);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching event count', error });
    }
});

// Start the server
app.listen(config.port, async () => {
    console.log(`Server running on http://localhost:${config.port}`);
    await connectToRabbitMQ();
});
