import { Entity, PrimaryGeneratedColumn, Column, Index, PrimaryColumn, OneToOne, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Group } from 'src/group/group.entity';


@Entity({
  name: 'group_user'
})
@Index(['groupId', 'userId'], { unique: true })
export class GroupUser {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({name: 'user_id'})
  user: number;

  @ManyToOne(type => Group, group => group.id, { onDelete: 'CASCADE' })
  @JoinColumn({name: 'group_id'})
  group: number;


  @Column({name: 'user_id'})
  userId: number;

  @Column({name: 'group_id'})
  groupId: number;

}
