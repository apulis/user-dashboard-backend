import { Entity, PrimaryGeneratedColumn, Column, Index, DeleteDateColumn, CreateDateColumn } from 'typeorm';



@Entity({
  name: 'permission'
})
export class Permission {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 191 })
  name: string;

  @Column('varchar', { length: 191, unique: true })
  key: string;

  @Column('varchar', { length: 191 })
  note?: string;

  @Column('varchar', { length: 191 })
  project: string;

  @CreateDateColumn({ name: 'create_time', type: 'timestamp' })
  createTime?: string;
}
