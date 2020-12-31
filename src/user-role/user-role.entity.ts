import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Role } from 'src/role/role.entity';


@Entity()
@Index(['userId', 'roleId'], { unique: true })
export class UserRole {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id'} )
  user: User;

  @ManyToOne(type => Role, role => role, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({name: 'role_id'})
  roleId: number;

  @Column({name: 'user_id'})
  userId: number;

}
