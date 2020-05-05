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

  @ManyToOne(type => User, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({name: 'userId'})
  userId: number;

  @ManyToOne(type => Role, role => role.id, { onDelete: 'CASCADE' })
  @JoinColumn({name: 'roleId'})
  roleId: number;
}
