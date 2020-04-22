import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';


@Entity({
  name: 'group_user'
})
@Index(['groupId', 'userId'], { unique: true })
export class GroupUser {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  groupId: number;

  @Column('int')
  userId: number;

}
