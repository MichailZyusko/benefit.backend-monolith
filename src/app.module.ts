import { Module } from "@nestjs/common";
import { ProductsModule } from "./modules/products/products.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { HttpErrorFilter } from "./exceptions/http-error.filter";
import { UsersModule } from "./modules/users/users.module";
import { StoresModule } from "./modules/stores/stores.module";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { CategoriesModule } from "./modules/categories/categories.module";

@Module({
  imports: [
    ProductsModule,
    UsersModule,
    StoresModule,
    CategoriesModule,
    ConfigModule.forRoot({
      envFilePath: [".env.local"],
      isGlobal: true,
      cache: true,
    }),
    ThrottlerModule.forRoot({
      ttl: 1,
      limit: 100,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: true,
        // ca: fs.readFileSync(
        //     `${process.cwd()}/cert/ca-certificate.crt`.toString()
        // ),
        ca: process.env.CA_CERT,
      },
      // database: `${process.env.DB_NAME}_${process.env.CONTRY}`,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== "production",
      cache: {
        duration: 1e4,
      },
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
