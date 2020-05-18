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

  @CreateDateColumn({ type: 'timestamp', name: 'create_date' })
  createTime?: string;
}
