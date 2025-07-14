import { EnumerationItemDTO } from '../../rest/model/enumeration-item-dto';
import { EventConditionTypeDTO } from '../../rest/model/event-condition-type-dto';
import { PlaceDTO } from '../../rest/model/place-dto';
import { NgTagSeverity } from './prime-ng-severities';

export interface EnumerationItem extends Partial<EnumerationItemDTO>, Partial<PlaceDTO>, Partial<EventConditionTypeDTO> {
  icon?: string,
  disabled?: boolean,
  severity?: NgTagSeverity
}
