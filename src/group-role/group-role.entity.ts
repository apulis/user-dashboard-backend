import { Entity, PrimaryGeneratedColumn, Index, JoinColumn, ManyToOne } from 'typeorm';
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
  @JoinColumn({name: 'roleId'})
  roleId: number;


  @ManyToOne(type => Group, group => group.id, { onDelete: 'CASCADE' })
  @JoinColumn({name: 'groupId'})
  groupId: number;
}
