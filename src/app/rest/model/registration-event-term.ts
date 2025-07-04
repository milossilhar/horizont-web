/**
 * OpenAPI definition
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { PaymentEventTermDTO } from './payment-event-term';
import { PersonEventTermDTO } from './person-event-term';
import { KnownPersonEventTermDTO } from './known-person-event-term';


export interface RegistrationEventTermDTO { 
    createdAt?: string;
    uuid?: string;
    id?: number;
    status?: RegistrationEventTermDTO.StatusEnum;
    name: string;
    surname: string;
    email: string;
    telPhone: string;
    consentGDPR: boolean;
    consentPhoto: boolean;
    emailConfirmSent?: boolean;
    emailPaymentInfoSent?: boolean;
    emailPaymentConfirmSent?: boolean;
    people?: Array<PersonEventTermDTO>;
    knownPeople?: Array<KnownPersonEventTermDTO>;
    payment?: PaymentEventTermDTO;
}
export namespace RegistrationEventTermDTO {
    export const StatusEnum = {
        Concept: 'CONCEPT',
        Queue: 'QUEUE',
        Confirmed: 'CONFIRMED'
    } as const;
    export type StatusEnum = typeof StatusEnum[keyof typeof StatusEnum];
}


