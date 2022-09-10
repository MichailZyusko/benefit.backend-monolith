import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Store } from "./entity/store.entity";
import { StoreController } from "./stores.controller";
import { StoreService } from "./stores.service";

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoresModule {}
