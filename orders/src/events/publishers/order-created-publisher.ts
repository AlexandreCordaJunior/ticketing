import {OrderCreatedEvent, Publisher, Subjects} from "@alexandre-corda/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}