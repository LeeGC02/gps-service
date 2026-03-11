import { Module } from '@nestjs/common';
import { GpsModule } from './gps/gps.module'; 

@Module({
    imports: [GpsModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
