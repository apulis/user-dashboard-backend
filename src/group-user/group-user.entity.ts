import { Entity, PrimaryGeneratedColumn, Column, Index, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Group } from 'src/group/group.entity';


@Entity({
  name: 'group_user'
})
@Index(['groupId', 'userId'], { unique: true })
export class GroupUser {

  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn('int')
  groupId: number;

  @PrimaryColumn('int')
  userId: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => Group)
  @JoinColumn()
  group: Group;


}
