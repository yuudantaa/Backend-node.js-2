import amqp from 'amqplib';

class ApplicationNotificationProducer {
    static async sendApplicationNotification(applicationId) {
        const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
        const channel = await connection.createChannel();
        await channel.assertQueue('application:notify', { durable: true });

        const message = JSON.stringify({ applicationId });
        channel.sendToQueue('application:notify', Buffer.from(message));

        setTimeout(() => connection.close(), 1000);
    }
}

export default ApplicationNotificationProducer;