import express from 'express';
import dotenv from 'dotenv';

import { Kafka } from 'kafkajs';
import mongoose, { Schema, Types } from 'mongoose';
import Booking from './models/booking';
import { bookingStatusEnum } from './common/enums';

dotenv.config({
	path: 'env/.env.dev',
});

const PORT = process.env.PORT;
const MONGODBURI: string = process.env.MONGO_URI ?? 'URI NOT Found!';

const app = express();
const kafka: Kafka = new Kafka({
	clientId: 'fasttravel',
	brokers: ['localhost:9092'],
});

//Initate kafka consumer
const consumer = kafka.consumer({ groupId: 'expired_booking_group' });

app.get('/', (req, res) => {
	res.send('kafka consumer is working!!');
});

app.listen(PORT, () => {
	console.log(`Kafka consumer started on port ${PORT}`);
});

async function consume(): Promise<void> {
	await consumer.subscribe({ topic: 'expired_bookings' }); //, fromBeginning: true
	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			if (message.value) {
				try {
					console.log('Consumed');
					const bookings: Array<{ bookingId: string }> = JSON.parse(
						message.value.toString()
					);
					if (bookings.length > 0) {
						for (let i = 0; i < bookings.length; i++) {
							const booking: { bookingId: string } = bookings[i];
							await Booking.updateOne(
								{
									bookingId: booking.bookingId,
								},
								{ status: bookingStatusEnum.COMPLETED, completedAt: new Date() }
							);
						}
					}
				} catch (error) {}
			}
		},
	});
}

mongoose.connect(MONGODBURI).catch((err: any) => {
	console.error(err);
	console.error(`Error occured while connecting to DB ${err.message}`);
});

mongoose.connection.once('open', async () => {
	//Connect kafka consumer
	await consumer.connect();
	consume(); //Start consuming
});
