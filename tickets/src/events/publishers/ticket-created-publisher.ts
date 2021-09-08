import {Publisher, Subjects, TicketCreatedEvent} from '@alexandre-corda/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}