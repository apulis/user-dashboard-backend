import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { IsString, IsEmail, Length, IsDateString, IsOptional } from 'class-validator';



@Entity({
  name: 'user'
})
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Length(5, 18)
  @Column('varchar', { length: 255 })
  userName: string;

  @IsString()
  @Length(5, 18)
  @Column('varchar', { length: 255 })
  password: string;

  @IsOptional()   
  @IsString()
  @Length(1, 18)
  @Column('varchar', { length: 255 })
  nickName: string;

  @IsOptional()
  @IsString()
  @Length(5, 18)
  @Column('varchar', { length: 255 })
  openId: string;

  @IsOptional()
  @IsString()
  @Length(1, 18)
  @Column('varchar', { length: 255 })
  registerType: string;

  @IsOptional()
  @IsEmail()
  @Column('varchar', { length: 255 })
  email: string;

  @IsOptional()
  @IsString()
  @Length(9, 15)
  @Column('varchar', { length: 255 })
  phone: string;

  @IsOptional()
  @IsString()
  @Length(5, 25)
  @Column('varchar', { length: 255 })
  note: string;

  @IsOptional()
  @Column('varchar', { length: 255 })
  createTime: string;
}
