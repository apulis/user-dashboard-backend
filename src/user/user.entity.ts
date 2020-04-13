import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';



@Entity({
  name: 'user'
})
export class User {

  @PrimaryGeneratedColumn() id: number;

  @Column('varchar', { length: 255 })
  userName: string;

  @Column('varchar', { length: 255 })
  password: string;

  @Column('varchar', { length: 255 })
  nickName: string;

  @Column('varchar', { length: 255 })
  openId: string;

  @Column('varchar', { length: 255 })
  registerType: string;

  @Column('varchar', { length: 255 })
  email: string;

  @Column('varchar', { length: 255 })
  phone: string;

  @Column('varchar', { length: 255 })
  note: string;
}
