const amqp = require('amqplib');

const messages = 'Hello, welcome to RabbitMQ';
const connectString = 'amqp://localhost';

const runProducer = async () => {
  const connection = await amqp.connect(connectString);
  const channel = await connection.createChannel();

  // TODO: Create queue
  const queue = 'test-topic';
  // TODO: Make queue durable if server restarts or crashes
  await channel.assertQueue(queue, { durable: true });

  // TODO: Send message to queue
  await channel.sendToQueue(queue, Buffer.from(messages));
  console.log(`Message: ${messages} sent to queue: ${queue}`);

  // TODO: Close connection
  await channel.close();
  await connection.close();
  // try {
  // } catch (error) {
  //   console.log(error);
  // }
}

runProducer().catch(console.error);