import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtSecret } from './env/envoriment';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
  ],
})
export class AppModule {}
