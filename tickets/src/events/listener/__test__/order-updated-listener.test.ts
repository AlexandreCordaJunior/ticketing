import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus } from "@alexandre-corda/common";
import { Ticket } from "../../../models/tickets";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: 'title',
        price: 10,
        userId: 'asd'
    });

    const orderId = new mongoose.Types.ObjectId().toHexString();

    ticket.set({
        orderId
    });

    await ticket.save();

    const data: OrderCancelledEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: ticket.id
        }
    }

    //@ts-ignore
    const message: Message = {
        ack: jest.fn()
    };

    return {
        listener, ticket, data, message, orderId
    }
};

it('updates the ticket, publishes the event and acks the message', async() => {
    const { listener, ticket, data, message } = await setup();

    await listener.onMessage(data, message);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(message.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});