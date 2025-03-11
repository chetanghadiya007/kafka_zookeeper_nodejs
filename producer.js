const kafka = require('kafka-node');
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const producer = new kafka.Producer(client);

const payloads = [
  { topic: 'test-topic', messages: 'Hello from Node.js Producer!' }
];

producer.on('ready', () => {
    producer.send(payloads, (err, data) => {
        if (err) {
            console.error('Error:', err);
        } else {
            console.log('Message sent successfully:', data);
        }
    });
});

producer.on('error', (err) => {
    console.error('Producer Error:', err);
});