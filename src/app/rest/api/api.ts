export * from './event.service';
import { EventHorizontService } from './event.service';
export * from './health.service';
import { HealthHorizontService } from './health.service';
export * from './registration.service';
import { RegistrationHorizontService } from './registration.service';
export const APIS = [EventHorizontService, HealthHorizontService, RegistrationHorizontService];
