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
  @JoinColumn({name: 'userId'})
  user: number;

  @ManyToOne(type => Group, group => group.id, { onDelete: 'CASCADE' })
  @JoinColumn({name: 'groupId'})
  group: number;


  @Column()
  userId: number;

  @Column()
  groupId: number;

}
