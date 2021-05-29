import request from "supertest";
import { app } from "../../app";

it("fails when a email that does not exist is supplied", async () => {
    await request(app)
        .post("/api/users/signin")
        .send({
            email: "ale@ale.com",
            password: "aakakkakaka"
        })
        .expect(400);
});

it("fails when an incorrect password is supplied", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "ale@ale.com",
            password: "aakakkakaka"
        })
        .expect(201);

    await request(app)
        .post("/api/users/signin")
        .send({
            email: "ale@ale.com",
            password: "0aakakkakaka"
        })
        .expect(400);
});

it("responds with a cookie when given correct password", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "ale@ale.com",
            password: "password"
        })
        .expect(201);

    const response = await request(app)
        .post("/api/users/signin")
        .send({
            email: "ale@ale.com",
            password: "password"
        })
        .expect(200);
    
    expect(response.get("Set-Cookie")).toBeDefined();
});