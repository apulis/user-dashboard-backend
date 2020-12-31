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
  @Column('varchar', { name: 'user_name', length: 191, unique: true, nullable: true })
  userName: string;

  @IsString()
  @Length(5, 20)
  @Column('varchar', { length: 191, nullable: true })
  password: string;

  @IsString()
  @Length(1, 18)
  @Column('varchar', { name: 'nick_name', length: 191, nullable: true })
  nickName: string;

  @IsString()
  @Length(5, 18)
  @Column('varchar', { name: 'open_id', length: 191, unique: true, nullable: true })
  openId: string;

  @IsString()
  @Length(1, 18)
  @Column('varchar', { name: 'register_type', length: 191, default: 'Account' })
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

  @Column('varchar', { name: 'create_time', length: 191, default: new Date().getTime() + '' })
  createTime: string;

  @Column('int', { name: 'is_delete', default: 0 })
  isDelete: number;

  @Column('varchar', { name: 'microsoft_id', length: 191, default: null, unique: true })
  microsoftId: string;

  @Column('varchar', { name: 'wechat_id', length: 191, default: null, unique: true })
  wechatId: string;

  @Column('varchar', { name: 'saml_id', length: 191, default: null, unique: true })
  samlId: string;

  @Column('int', { name: 'job_max_time_second', default: null })
  jobMaxTimeSecond?: number;
}
