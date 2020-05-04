import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Role } from 'src/role/role.entity';


@Entity({
  name: 'user-role'
})
@Index(['userId', 'roleId'], { unique: true })
export class UserRole {

  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn('int')
  userId: number;

  @PrimaryColumn('int')
  roleId: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => Role)
  @JoinColumn()
  role: Role;
}
