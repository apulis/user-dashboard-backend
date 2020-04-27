import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne } from 'typeorm';


@Entity({
  name: 'user-role'
})
@Index(['userId', 'roleId'], { unique: true })
export class UserRole {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  userId: number;

  @Column('int')
  roleId: number;
}
