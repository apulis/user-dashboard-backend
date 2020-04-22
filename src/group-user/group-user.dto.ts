import { IsArray, ArrayNotEmpty } from 'class-validator'

export class AddUsersToGroupDto {
  @ArrayNotEmpty()
  @IsArray()
  userNames: string[];
  
  @ArrayNotEmpty()
  @IsArray()
  groupNames: string[];
}