import { EnumerationItemDTO } from '../../rest/model/enumeration-item-dto';
import { PlaceDTO } from '../../rest/model/place-dto';
import { NgTagSeverity } from './prime-ng-severities';

export interface EnumerationItem extends Partial<EnumerationItemDTO>, Partial<PlaceDTO> {
  icon?: string,
  severity?: NgTagSeverity
}
