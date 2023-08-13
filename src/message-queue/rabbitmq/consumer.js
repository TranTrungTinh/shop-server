const amqp = require('amqplib');

const connectString = 'amqp://localhost';

const runConsumer = async () => {
  const connection = await amqp.connect(connectString);
  const channel = await connection.createChannel();

  // TODO: Create queue
  const queue = 'test-topic';
  await channel.assertQueue(queue);

  channel.consume(queue, (message) => {
    console.log(`Message received: ${message.content.toString()}`);
  }, {
    // TODO: Make sure message is not lost if server restarts or crashes
    noAck: true
  });
}

runConsumer().catch(console.error);