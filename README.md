# Node.js Kafka with Zookeeper and MySQL Integration Guide

This guide walks you through integrating **Node.js**, **Apache Kafka**, **Zookeeper**, and **MySQL** for building event-driven applications with data persistence.

---

## 🚀 Step 1: Install Kafka and Zookeeper

1. Download Apache Kafka from [Kafka's official site](https://kafka.apache.org/downloads).
2. Extract the Kafka package:
   ```bash
   tar -xzf kafka_2.13-3.5.0.tgz
   cd kafka_2.13-3.5.0
   ```
3. Start **Zookeeper**:
   ```bash
   bin/zookeeper-server-start.sh config/zookeeper.properties
   ```
4. Start **Kafka Server**:
   ```bash
   bin/kafka-server-start.sh config/server.properties
   ```

---

## 📦 Step 2: Setup Node.js Project

1. Initialize a new Node.js project:
   ```bash
   mkdir kafka-nodejs-app
   cd kafka-nodejs-app
   npm init -y
   ```
2. Install the required dependencies:
   ```bash
   npm install kafka-node mysql2
   ```

---

## 📝 Step 3: Create Kafka Producer

Create a new file `producer.js` and add the following code:

```javascript
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
```

---

## 📥 Step 4: Create Kafka Consumer with MySQL Integration

Create a new file `consumer.js` and add the following code:

```javascript
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
```

---

## 🛠️ Step 5: Run the Application

1. Start **Zookeeper** and **Kafka** as mentioned in **Step 1**.
2. Create a Kafka topic:
   ```bash
   bin/kafka-topics.sh --create --topic test-topic --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
   ```
3. Create a MySQL table:
   ```sql
   CREATE DATABASE kafka_data;
   USE kafka_data;
   CREATE TABLE messages (
       id INT AUTO_INCREMENT PRIMARY KEY,
       content TEXT NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```
4. Run the producer:
   ```bash
   node producer.js
   ```
5. In a separate terminal, run the consumer:
   ```bash
   node consumer.js
   ```
6. Verify that messages are stored in the **`messages`** table in MySQL.

---

## ✅ Step 6: Best Practices

- Use **environment variables** for dynamic configuration in production.
- Implement error-handling strategies to manage failures in messaging.
- Ensure you have proper log management in place to track Kafka events.

---

If you have any questions or issues during integration, feel free to ask! 🚀

