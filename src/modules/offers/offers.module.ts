import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "../products/entity/product.entity";
import { Store } from "../stores/entity/store.entity";
import { Offer } from "./entity/offer.entity";
import { OffersController } from "./offers.controller";
import { OffersService } from "./offers.service";

@Module({
  imports: [TypeOrmModule.forFeature([Product, Offer, Store])],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
