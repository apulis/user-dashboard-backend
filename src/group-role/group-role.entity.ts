import { Entity, PrimaryGeneratedColumn, Index, JoinColumn, ManyToOne, Column } from 'typeorm';
import { Group } from 'src/group/group.entity';
import { Role } from 'src/role/role.entity';


@Entity({
  name: 'group_role'
})
@Index(['groupId', 'roleId'], { unique: true })
export class GroupRole {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Role, role => role.id, { onDelete: 'CASCADE' })
  @JoinColumn({name: 'role_id'})
  role: number;


  @ManyToOne(type => Group, group => group.id, { onDelete: 'CASCADE' })
  @JoinColumn({name: 'group_id'})
  group: number;


  @Column({name: 'role_id'})
  roleId: number;

  @Column({name: 'group_id'})
  groupId: number;
}
