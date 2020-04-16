import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { IsString, IsEmail, Length, IsDateString, IsOptional } from 'class-validator';



@Entity({
  name: 'group'
})
export class Group {

  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Length(5, 18)
  @Column('varchar', { length: 255, unique: true })
  name: string;


  @IsString()
  @Length(1, 40)
  @Column('varchar', { length: 255, unique: true })
  desc: string;
  
}
