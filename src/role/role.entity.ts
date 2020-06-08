import { Entity, PrimaryGeneratedColumn, Column, Index, DeleteDateColumn, OneToMany } from 'typeorm';
import { IsString, IsEmail, Length, IsDateString, IsOptional } from 'class-validator';


@Entity({
  name: 'role'
})
export class Role {

  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Length(5, 18)
  @Column('varchar', { length: 191, unique: true })
  name: string;

  @IsString()
  @Length(1, 40)
  @Column('varchar', { length: 191 })
  note: string;

  @IsString()
  @Length(1, 40)
  @Column('varchar', { length: 191, default: new Date().getTime() + '' })
  createTime?: string;

  @Column('int', { default: 0 })
  isPreset: number;
}
