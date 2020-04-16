import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { IsString, IsEmail, Length, IsDateString, IsOptional } from 'class-validator';



@Entity({
  name: 'group'
})
@Index(['name'], {unique: true})
export class Group {

  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Length(5, 18)
  @Column('varchar', { length: 255 })
  name: string;

  @IsString()
  @Length(1, 40)
  @Column('varchar', { length: 255 })
  note: string;

  @IsString()
  @Length(1, 40)
  @Column('varchar', { length: 255 })
  createTime: string;
  
  @Column('int', { default: 0 })
  isDelete: number;
}
