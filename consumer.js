const kafka = require('kafka-node');
const mysql = require('mysql2');

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kafka_data'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL Database');
});

// Kafka consumer setup
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const consumer = new kafka.Consumer(
  client,
  [{ topic: 'test-topic', partition: 0 }],
  { autoCommit: true }
);

consumer.on('message', (message) => {
    console.log('Received message:', message.value);

    const sql = 'INSERT INTO messages (content) VALUES (?)';
    db.query(sql, [message.value], (err, result) => {
        if (err) throw err;
        console.log('Message saved to database:', result.insertId);
    });
});

consumer.on('error', (err) => {
    console.error('Consumer Error:', err);
});