import { BadRequestException } from "@nestjs/common";
import { DBExceptions } from "src/exceptions";
import { Offer } from "src/modules/stores/entity/offer.entity";
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
} from "typeorm";

type Props = {
  product: Product;
  barcode: string;
};
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

  @Index({ fulltext: true })
  @Column()
  name: string;

  @Column({ length: 5000 })
  description: string;

  @Column({ nullable: true, default: null })
  image: string;

  @Column({ default: 0, unsigned: true, select: false })
  popularity: number;

  @OneToMany(() => Offer, (offer) => offer.product, {
    cascade: ["remove"],
  })
  offers: Offer[];

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  //#################################################################//

  static checkExistenceOfProduct({ product, barcode }: Props) {
    if (product) {
      throw new BadRequestException({
        message: `Product with barcode: ${barcode} already exists`,
        code: DBExceptions.PRODUCT_ALREADY_EXISTS,
      });
    }
  }
}
