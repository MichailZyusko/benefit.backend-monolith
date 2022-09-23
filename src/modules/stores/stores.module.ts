import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "../products/entity/product.entity";
import { Offer } from "./entity/offer.entity";
import { Store } from "./entity/store.entity";
import { StoreController } from "./stores.controller";
import { StoreService } from "./stores.service";

@Module({
  imports: [TypeOrmModule.forFeature([Store, Offer, Product])],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoresModule {}
