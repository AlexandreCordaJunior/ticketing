import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { TicketUpdatedEvent } from "@alexandre-corda/common";

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'title',
        price: 10
    });

    await ticket.save();

    const data: TicketUpdatedEvent['data'] = {
        version: ticket.version + 1,
        id: ticket.id,
        title: 'new title',
        price: 31,
        userId: 'userId'
    };

    //@ts-ignore
    const message: Message = {
        ack: jest.fn()
    };

    return {
        listener, data, message, ticket
    };
};

it('finds, updates and saves a ticket', async () => {
    const { listener, data, message, ticket } = await setup();
    await listener.onMessage(data, message);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
    
});

it('acks the message', async () => {
    const { listener, data, message } = await setup();
    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skiped version', async () => {
    const { listener, data, message } = await setup();

    data.version = 10;

    try {
        await listener.onMessage(data, message);
    }
    catch(e) {
        //ignored
    }
    expect(message.ack).not.toHaveBeenCalled();
});