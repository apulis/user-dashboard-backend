import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";


@Entity({
  name: 'reset_password'
})
export class ResetPassword {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.id, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'userId'} )
  user: number;

  @Column({
    unique: true,
  })
  userId: number;
}
