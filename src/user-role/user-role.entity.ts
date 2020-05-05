import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Role } from 'src/role/role.entity';


@Entity()
@Index(['userId', 'roleId'], { unique: true })
export class UserRole {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.id, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'userId'} )
  user: number;

  @ManyToOne(type => Role, role => role.id, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'roleId' })
  role: number;

  @Column()
  roleId: number;

  @Column()
  userId: number;

}
