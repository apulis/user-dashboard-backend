import { IsArray, ArrayNotEmpty } from 'class-validator'

export class AddUsersToGroupDto {
  @ArrayNotEmpty()
  @IsArray()
  userIds: number[];
  
  @ArrayNotEmpty()
  @IsArray()
  groupIds: number[];
}