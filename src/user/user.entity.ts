import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsString, IsEmail, Length } from 'class-validator';


@Entity({
  name: 'user'
})
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Length(5, 18)
  @Column('varchar', { length: 191, unique: true, nullable: true })
  userName: string;

  @IsString()
  @Length(5, 20)
  @Column('varchar', { length: 191, nullable: true })
  password: string;

  @IsString()
  @Length(1, 18)
  @Column('varchar', { length: 191, nullable: true })
  nickName: string;

  @IsString()
  @Length(5, 18)
  @Column('varchar', { length: 191, unique: true, nullable: true })
  openId: string;

  @IsString()
  @Length(1, 18)
  @Column('varchar', { length: 191, default: 'Account' })
  registerType: string;

  @IsEmail()
  @Column('varchar', { length: 191, nullable: true })
  email: string;

  @IsString()
  @Length(9, 15)
  @Column('varchar', { length: 191, nullable: true })
  phone: string;

  @IsString()
  @Length(5, 25)
  @Column('varchar', { length: 191, nullable: true })
  note: string;

  @Column('varchar', { length: 191, default: new Date().getTime() + '' })
  createTime: string;

  @Column('int', { default: 0 })
  isDelete: number;

  @Column('varchar', { length: 191, default: null, unique: true })
  microsoftId: string;

  @Column('varchar', { length: 191, default: null, unique: true })
  wechatId: string;

  @Column('varchar', { length: 191, default: null, unique: true })
  samlId: string;

  @Column('int', { default: null })
  jobMaxTimeSecond?: number;

}
