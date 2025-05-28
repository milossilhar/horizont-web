export * from './event.service';
import { EventHorizontService } from './event.service';
export * from './event-term.service';
import { EventTermHorizontService } from './event-term.service';
export * from './health.service';
import { HealthHorizontService } from './health.service';
export * from './public.service';
import { PublicHorizontService } from './public.service';
export const APIS = [EventHorizontService, EventTermHorizontService, HealthHorizontService, PublicHorizontService];
