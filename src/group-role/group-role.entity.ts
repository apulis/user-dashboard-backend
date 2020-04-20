import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';


@Entity({
  name: 'group_role'
})
@Index(['name'], {unique: true})
export class GroupRole {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  roleName: string;

  @Column('varchar', { length: 255 })
  groupName: string;
}
