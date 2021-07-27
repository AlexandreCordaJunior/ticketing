import request from "supertest";
import { app } from "../../app";
import mongoose from 'mongoose';

it("returns a 404 if the provided id does not exist", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set("Cookie", global.signin())
        .send({
            title: "jnasd",
            price: 20
        }
    ).expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: "jnasd",
            price: 20
        }
    ).expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
    const response = await request(app)
        .post("/api/tickets/")
        .set("Cookie", global.signin())
        .send({
            title: "jnasd",
            price: 20
        }
    );

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", global.signin())
        .send({
            title: "jnasd",
            price: 20
        }
    ).expect(401);
});

it("returns a 400 if the user provided an invalid title or price", async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post("/api/tickets/")
        .set("Cookie", cookie)
        .send({
            title: "jnasd",
            price: 20
        }
    );

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "",
            price: 20
        }
    ).expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "as",
            price: -20
        }
    ).expect(400);
});

it("updates ticket provided valid inputs", async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post("/api/tickets/")
        .set("Cookie", cookie)
        .send({
            title: "jnasd",
            price: 20
        }
    );

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "jnasdjnasd",
            price: 20
        }
    ).expect(200);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie);
    
    expect(ticketResponse.body.title).toEqual("jnasdjnasd");
    expect(ticketResponse.body.price).toEqual(20);
});