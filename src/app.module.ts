import { Module } from '@nestjs/common';
import { GpsModule } from './gps/gps.module'; 
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
    }),
    GpsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
