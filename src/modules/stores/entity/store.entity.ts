import { BadRequestException } from "@nestjs/common";
import { DBExceptions } from "src/exceptions";
import { Offer } from "./offer.entity";
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from "typeorm";
import { StoreFranchise } from "../enums";

type Props = {
  store: Store | null;
  address: string;
  franchise: StoreFranchise;
};
@Entity()
@Unique(["address", "franchise"])
export class Store {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  address: string;

  @Column({
    type: "enum",
    enum: StoreFranchise,
  })
  franchise: StoreFranchise;

  @OneToMany(() => Offer, (offer) => offer.store, {
    cascade: ["remove"],
  })
  offer: Offer;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  //##########################################################//

  static checkExistenceOfStore({ store, address, franchise }: Props) {
    if (store) {
      throw new BadRequestException({
        message: `Store with address: "${address}" and franchise: "${franchise}" already exists`,
        code: DBExceptions.STORE_ALREADY_EXISTS,
      });
    }
  }
}
