import { IsArray } from 'class-validator'

export class AddUsersToGroupDto {
  @IsArray()
  userNames: string[];
  
  @IsArray()
  groupNames: string[];
}