import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("API INFO")
@Controller()
export class AppController {
  @Get("ping")
  getHello(): string {
    return "Pong";
  }
}
