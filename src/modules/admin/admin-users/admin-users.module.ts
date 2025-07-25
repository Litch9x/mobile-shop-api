import { Module } from '@nestjs/common';
import { CustomersModule } from '../../../modules/customers/customers.module';
import { UsersModule } from '../../../modules/users/users.module';
import { AdminUsersService } from './admin-users.service';
import { AdminUsersController } from './admin-users.controller';

@Module({
  imports: [UsersModule, CustomersModule],
  controllers: [AdminUsersController],
  providers: [AdminUsersService],
  exports: [AdminUsersService],
})
export class AdminUsersModule {}
