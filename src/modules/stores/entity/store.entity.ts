import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { StoreFranchise } from "../enums";

@Entity()
export class Store {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  address: string;

  @Column({
    type: "enum",
    enum: StoreFranchise,
  })
  franchise: StoreFranchise;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;
}
