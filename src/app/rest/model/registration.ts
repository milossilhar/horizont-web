/**
 * OpenAPI definition
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { KnownPersonDTO } from './known-person';
import { PersonDTO } from './person';
import { PaymentDTO } from './payment';


export interface RegistrationDTO { 
    createdAt?: string;
    uuid?: string;
    id?: number;
    status?: RegistrationDTO.StatusEnum;
    name: string;
    surname: string;
    email: string;
    telPhone: string;
    people?: Array<PersonDTO>;
    knownPeople?: Array<KnownPersonDTO>;
    payment?: PaymentDTO;
}
export namespace RegistrationDTO {
    export type StatusEnum = 'CONCEPT' | 'QUEUE' | 'ACCEPTED' | 'CONFIRMED';
    export const StatusEnum = {
        Concept: 'CONCEPT' as StatusEnum,
        Queue: 'QUEUE' as StatusEnum,
        Accepted: 'ACCEPTED' as StatusEnum,
        Confirmed: 'CONFIRMED' as StatusEnum
    };
}


