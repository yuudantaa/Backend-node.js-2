import 'dotenv/config';
import amqp from 'amqplib';
import ApplicationListener from './ApplicationListener.js';

const init = async () => {
    const listener = new ApplicationListener();
    let connection;
    let retries = 0;
    const maxRetries = 5;
    const retryDelay = 3000; 

    while (retries < maxRetries) {
        try {
            connection = await amqp.connect(process.env.RABBITMQ_SERVER);
            const channel = await connection.createChannel();

            await channel.assertQueue('application:notify', { durable: true });

            // Consume messages
            channel.consume('application:notify', listener.listen, { noAck: true });

            console.log('Consumer is running, waiting for messages...');
            break;
        } catch (error) {
            retries++;
            console.error(`Connection failed. Retrying... (${retries}/${maxRetries})`, error.message);
            if (retries < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            } else {
                console.error('Max retries reached. Exiting.');
                process.exit(1);
            }
        }
    }
};

init();