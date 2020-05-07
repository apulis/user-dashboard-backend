import { Entity, PrimaryGeneratedColumn, Column, Index, DeleteDateColumn, CreateDateColumn } from 'typeorm';



@Entity({
  name: 'permission'
})
export class Permission {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { length: 255, unique: true })
  key: string;

  @Column('varchar', { length: 255 })
  note?: string;

  @Column('varchar', { length: 255 })
  project: string;

  @CreateDateColumn({ type: 'timestamp', name: 'create_date' })
  createTime?: string;
}
