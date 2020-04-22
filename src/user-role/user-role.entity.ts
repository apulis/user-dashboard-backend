import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { IsString, IsEmail, Length, IsDateString, IsOptional } from 'class-validator';


@Entity({
  name: 'user-role'
})
@Index(['roleName', 'userName'], { unique: true })
export class UserRole {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  userName: string;

  @Column('varchar', { length: 255 })
  roleName: string;
}
