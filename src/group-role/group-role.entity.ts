import { Entity, PrimaryGeneratedColumn, Column, Index, OneToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Group } from 'src/group/group.entity';
import { Role } from 'src/role/role.entity';


@Entity({
  name: 'group_role'
})
@Index(['groupId', 'roleId'], { unique: true })
export class GroupRole {

  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn('int')
  roleId: number;

  @PrimaryColumn('int')
  groupId: number;

  @OneToOne(() => Group)
  @JoinColumn()
  group: Group;

  @OneToOne(() => Role)
  @JoinColumn()
  role: Role;

}
