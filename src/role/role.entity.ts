import { Entity, PrimaryGeneratedColumn, Column, Index, DeleteDateColumn } from 'typeorm';
import { IsString, IsEmail, Length, IsDateString, IsOptional } from 'class-validator';



@Entity({
  name: 'role'
})
@Index(['name'], {unique: true})
export class Role {

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
  isPreset: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date

}
