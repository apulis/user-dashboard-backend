import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { IsString, IsEmail, Length, IsDateString, IsOptional } from 'class-validator';


@Entity({
  name: 'user'
})
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Length(5, 18)
  @Column('varchar', { length: 255, unique: true })
  userName: string;

  @IsString()
  @Length(5, 18)
  @Column('varchar', { length: 255 })
  password: string;

  @IsString()
  @Length(1, 18)
  @Column('varchar', { length: 255, nullable: true })
  nickName: string;

  @IsString()
  @Length(5, 18)
  @Column('varchar', { length: 255 })
  openId: string;

  @IsString()
  @Length(1, 18)
  @Column('varchar', { length: 255 })
  registerType: string;

  @IsEmail()
  @Column('varchar', { length: 255, nullable: true })
  email: string;

  @IsString()
  @Length(9, 15)
  @Column('varchar', { length: 255, nullable: true })
  phone: string;

  @IsString()
  @Length(5, 25)
  @Column('varchar', { length: 255, nullable: true })
  note: string;

  @Column('varchar', { length: 255 })
  createTime: string;

  @Column('int', { default: 0 })
  isDelete: number;
}
