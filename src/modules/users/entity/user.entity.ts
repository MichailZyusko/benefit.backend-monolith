import { BadRequestException } from "@nestjs/common";
import { DBExceptions } from "src/exceptions";
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

type Props = {
  user: User | null;
  email: string;
};

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

  //##########################################################//

  static checkExistenceOfUser({ user, email }: Props) {
    if (user) {
      throw new BadRequestException({
        message: `User with email: ${email} already exists`,
        code: DBExceptions.USER_ALREADY_EXISTS,
      });
    }
  }
}
