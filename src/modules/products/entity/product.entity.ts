import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Index,
} from "typeorm";

@Entity({
  orderBy: {
    popularity: "DESC",
  },
})
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index("barcode-idx", { unique: true })
  @Column({ unique: true })
  barcode: string;

  @Column()
  name: string;

  @Column({ length: 5000 })
  description: string;

  @Column({ nullable: true, default: null })
  image: string;

  @Column({ default: 0, unsigned: true, select: false })
  popularity: number;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;
}
