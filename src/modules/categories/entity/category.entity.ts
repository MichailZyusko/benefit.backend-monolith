import { BadRequestException } from "@nestjs/common";
import { DBExceptions } from "src/exceptions";
import { Product } from "src/modules/products/entity/product.entity";
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  Unique,
} from "typeorm";

type Props = {
  category: Category;
  name: string;
  level: number;
  parent_id: number;
};

@Entity()
@Unique(["parent_id", "level", "name"])
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  parent_id: number;

  @Column()
  level: number;

  @Column()
  name: string;

  @OneToMany(() => Product, (product) => product.category)
  product: Product[];

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  //#################################################################//

  static checkExistenceOfCategory({ category, name, level, parent_id }: Props) {
    if (category) {
      throw new BadRequestException({
        message: `Category with name: ${name} & level: ${level} & parent_id: ${parent_id} already exists `,
        code: DBExceptions.CATEGORY_ALREADY_EXISTS,
      });
    }
  }
}
