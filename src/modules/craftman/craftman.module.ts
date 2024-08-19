import { Module } from '@nestjs/common';
import { CraftmanService } from './craftman.service';
import { CraftmanController } from './craftman.controller';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from 'src/guards/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Craftsman } from './entities/craftman.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Craftsman, User])],
  controllers: [CraftmanController],
  providers: [CraftmanService, AuthGuard],
})
export class CraftmanModule {}
