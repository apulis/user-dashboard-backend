import { Entity, PrimaryGeneratedColumn, Column, Index, DeleteDateColumn } from 'typeorm';
import { IsString, IsEmail, Length, IsOptional } from 'class-validator';



@Entity({
  name: 'group'
})
@Index(['name'], {unique: true})
export class Group {

  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Length(5, 18)
  @Column('varchar', { length: 191 })
  name: string;

  @IsString()
  @Length(1, 40)
  @Column('varchar', { length: 191, default: '' })
  note: string;

  @IsString()
  @Length(1, 40)
  @Column('varchar', { length: 191 })
  createTime: string;

}
