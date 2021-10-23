import { TicketCreatedEvent } from "@alexandre-corda/common";
import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    const listener = new TicketCreatedListener(natsWrapper.client);
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'title',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString()
    };

    //@ts-ignore
    const message: Message = {
        ack: jest.fn()
    };

    return {
        listener, data, message
    };
};

it('created and saves a ticket', async () => {
    const { listener, data, message } = await setup();
    await listener.onMessage(data, message);

    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
    const { listener, data, message } = await setup();
    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
});