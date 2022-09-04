import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ProductsModule } from "./modules/products/products.module";
import { PriceParserModule } from "./modules/price-parser/price-parser.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./modules/products/entity/product.entity";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { HttpErrorFilter } from "./exceptions/http-error.filter";

@Module({
  imports: [
    ProductsModule,
    PriceParserModule,
    ConfigModule.forRoot({
      envFilePath: [".env.local"],
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // database: `${process.env.DB_NAME}_${process.env.CONTRY}`,
      entities: [Product],
      synchronize: process.env.NODE_ENV !== "production",
      cache: {
        duration: 1e4,
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
})
export class AppModule {}
