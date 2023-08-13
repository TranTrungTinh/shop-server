const { Kafka, logLevel } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'shop-app',
  brokers: ['localhost:9092'],
  // logLevel: logLevel.DEBUG,
})

const consumer = kafka.consumer({ groupId: 'test-group' })

const runConsumer = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      })
    },
  })
}

runConsumer().catch(console.error)