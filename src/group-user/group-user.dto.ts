import { MaxLength } from 'class-validator'

export class AddUsersToGroupDto {
  @MaxLength(50, {
    each: true,
  })
  userNames: string[];
  
  @MaxLength(50, {
    each: true,
  })
  groupNames: string[];
}