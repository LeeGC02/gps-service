// enpoints REST
import { Controller, Get } from "@nestjs/common";

@Controller('gps')
export class GpsController {
    @Get()
    helloworld() {
        return 'hello world';
    }
}