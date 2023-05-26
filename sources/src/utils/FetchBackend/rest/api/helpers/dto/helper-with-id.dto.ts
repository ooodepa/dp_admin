import HelperDto from './helper.dto';

interface HelperContactTypes {
  dp_id: number;
  dp_helperId: string;
  dp_contactTypeId: number;
  dp_value: string;
  dp_isHidden: boolean;
}

export default interface HelperWithIdDto extends HelperDto {
  dp_id: string;
  dp_helperContactTypes: HelperContactTypes[];
}
