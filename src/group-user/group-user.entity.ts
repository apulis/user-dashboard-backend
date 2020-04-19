import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';


@Entity({
  name: 'group_user'
})
export class GroupUser {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  groupName: string;

  @Column('varchar', { length: 255 })
  userName: string;

}
