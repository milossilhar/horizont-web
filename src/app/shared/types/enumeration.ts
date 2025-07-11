import { EnumerationDTO } from '../../rest/model/enumeration-dto';

export interface Enumeration extends EnumerationDTO {
  name?: string;
  // for future local frontend extending
}