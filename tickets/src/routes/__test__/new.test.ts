import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";
import {natsWrapper} from '../../nats-wrapper';

it("responds with details about the current user", async () => {
    const response = await request(app)
        .post("/api/tickets")
        .send();
    expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
    await request(app)
        .post("/api/tickets")
        .send({})
        .expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send();
    expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: "",
            price: 10
        })
        .expect(400);

    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: null,
            price: 10
        })
        .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: "abc",
            price: -10
        })
        .expect(400);

    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: "abc"
        })
        .expect(400);
});

it("creates a ticket with valid inputs", async () => {
    let tickets = await Ticket.find({});
    
    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: "abc",
            price: 20
        })
        .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
});

it("publishes an event", async () => {
    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: "abc",
            price: 20
        })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});