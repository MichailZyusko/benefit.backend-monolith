import { BadRequestException } from "@nestjs/common";
import { DBExceptions } from "src/exceptions";
import { Product } from "src/modules/products/entity/product.entity";
import { Store } from "src/modules/stores/entity/store.entity";
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
} from "typeorm";

type Props = {
  address: string;
  barcode: string;
  offer: Offer;
};

@Entity()
@Unique("UNIQUE_PRODUCT_IN_A_STORE", ["store", "product"])
export class Offer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Product, (product) => product.offers, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  product: Product;

  @ManyToOne(() => Store, (store) => store.offer, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  store: Store;

  @Column({ unsigned: true })
  price: number;

  @Column({ unsigned: true })
  quantity: number;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  //#################################################################//

  static checkExistenceOfOffer({ offer, address, barcode }: Props) {
    if (offer) {
      throw new BadRequestException({
        message: `Offer with address: "${address}" and barcode: "${barcode}" already exists`,
        code: DBExceptions.OFFER_ALREADY_EXISTS,
      });
    }
  }
}
