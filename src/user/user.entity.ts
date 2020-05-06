import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany } from 'typeorm';
import { IsString, IsEmail, Length, IsDateString, IsOptional } from 'class-validator';
import { UserRole } from 'src/user-role/user-role.entity';


@Entity({
  name: 'user'
})
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Length(5, 18)
  @Column('varchar', { length: 255, unique: true, nullable: true })
  userName: string;

  @IsString()
  @Length(5, 18)
  @Column('varchar', { length: 255, nullable: true })
  password: string;

  @IsString()
  @Length(1, 18)
  @Column('varchar', { length: 255, nullable: true })
  nickName: string;

  @IsString()
  @Length(5, 18)
  @Column('varchar', { length: 255, unique: true })
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

  @Column('varchar', { length: 255, default: null })
  microsoftId: string;

  @Column('varchar', { length: 255, default: null })
  wechatId: string;

}
