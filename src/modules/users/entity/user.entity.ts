import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true, default: null })
  image: string;

  @Column({ unique: true, select: false })
  email: string;

  @Column({ select: false })
  password: string;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;
}
