export * from './enumeration.service';
import { EnumerationHorizontService } from './enumeration.service';
export * from './event.service';
import { EventHorizontService } from './event.service';
export * from './health.service';
import { HealthHorizontService } from './health.service';
export * from './registration.service';
import { RegistrationHorizontService } from './registration.service';
export const APIS = [EnumerationHorizontService, EventHorizontService, HealthHorizontService, RegistrationHorizontService];
