import { ExpirationCompleteEvent, Publisher, Subjects } from "@alexandre-corda/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}