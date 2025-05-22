export * from './event.service';
import { EventHorizontService } from './event.service';
export * from './health.service';
import { HealthHorizontService } from './health.service';
export * from './public.service';
import { PublicHorizontService } from './public.service';
export * from './user-controller.service';
import { UserControllerHorizontService } from './user-controller.service';
export const APIS = [EventHorizontService, HealthHorizontService, PublicHorizontService, UserControllerHorizontService];
