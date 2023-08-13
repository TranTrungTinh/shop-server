const { Kafka, logLevel } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'shop-app',
  brokers: ['localhost:9092'],
  // logLevel: logLevel.NOTHING,
})

const producer = kafka.producer()

const runProducer = async () => {
  await producer.connect()
  await producer.send({
    topic: 'test-topic',
    messages: [
      { value: '[SHOP-APP] Hello KafkaJS user!' },
    ],
  })

  await producer.disconnect()
}

runProducer().catch(console.error)