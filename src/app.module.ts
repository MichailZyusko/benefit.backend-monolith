import { Module } from "@nestjs/common";
import { ProductsModule } from "./modules/products/products.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { HttpErrorFilter } from "./exceptions/http-error.filter";
import { UsersModule } from "./modules/users/users.module";
import { StoresModule } from "./modules/stores/stores.module";

@Module({
  imports: [
    ProductsModule,
    UsersModule,
    StoresModule,
    ConfigModule.forRoot({
      envFilePath: [".env.local"],
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get("DB_HOST"),
        port: +config.get("DB_PORT"),
        username: config.get("DB_USER"),
        password: config.get("DB_PASSWORD"),
        database: config.get("DB_NAME"),
        // database: `${process.env.DB_NAME}_${process.env.CONTRY}`,
        autoLoadEntities: true,
        synchronize: config.get("NODE_ENV") !== "production",
      }),
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
})
export class AppModule {}
