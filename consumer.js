import express from 'express';
import amqp from 'amqplib';
import SlidingWindowCounter from './sliding_window_counter.js';
import config from './config.js';

const RABBITMQ_URL = config.rabbitMQUrl;
const WINDOW_SIZE = config.windowSize;

let slidingWindowCounter = new SlidingWindowCounter(WINDOW_SIZE);

const app = express();

async function connectToRabbitMQ() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue('event_queue');
        console.log('Waiting for messages in event_queue...');

        channel.consume('event_queue', (msg) => {
            const event = JSON.parse(msg.content.toString());
            console.log('Received event:', event);

            // Record the event in the sliding window
            slidingWindowCounter.recordEvent(event.timestamp);
            console.log('Current event count:', slidingWindowCounter.getEventCount());

            // Acknowledge the message
            channel.ack(msg);
        });
    } catch (err) {
        console.error('Failed to connect to RabbitMQ', err);
    }
}

// API route to get the event count in the sliding window (last 5 minutes)
app.get('/events/count', (req, res) => {
    const eventCount = slidingWindowCounter.getEventCount();
    res.status(200).json({ eventCount });
});

// Start the Express server for the consumer API
app.listen(config.consumerPort, async () => {
    console.log(`Consumer server running on http://localhost:${config.consumerPort}`);
    await connectToRabbitMQ();
});
