import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

@Entity({
  orderBy: {
    createdAt: "DESC",
  },
})
export class Product {
  @PrimaryColumn()
  barcode: string;

  @Column()
  name: string;

  @Column({ length: 5000 })
  description: string;

  @Column({ nullable: true, default: null })
  image: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
