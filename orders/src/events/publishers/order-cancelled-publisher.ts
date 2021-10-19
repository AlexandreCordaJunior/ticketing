import {OrderCancelledEvent, Publisher, Subjects} from "@alexandre-corda/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}