import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { IsString, IsEmail, Length, IsDateString, IsOptional } from 'class-validator';


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
