import {Publisher, Subjects, TicketUpdatedEvent} from '@alexandre-corda/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}