import { Entity, PrimaryGeneratedColumn, Column, Index, DeleteDateColumn, CreateDateColumn } from 'typeorm';



@Entity({
  name: 'permission'
})
@Index(['key'], {unique: true})
export class Permission {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { length: 255 })
  key: string;

  @Column('varchar', { length: 255 })
  note: string;

  @Column('varchar', { length: 255 })
  createTime: string;
  
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date
}
