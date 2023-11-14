import ContactTypeDto from './contact-type.dto';

export default interface ContactTypeWithIdDto extends ContactTypeDto {
  dp_id: number;
}
