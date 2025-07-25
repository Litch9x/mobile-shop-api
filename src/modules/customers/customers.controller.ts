import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomersService } from './customers.service';
import { OrdersService } from '../orders/orders.service';
import { Customers } from '../../entities/customer.schema';
import { Orders } from '../../entities/order.schema';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { Cookies } from 'src/decorators/cookies.decorator';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly ordersService: OrdersService,
  ) { }
  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('fullName') fullName: string,
    @Body('address') address: string,
    @Body('phone') phone: string,
  ): Promise<{ data: Customers }> {
    return await this.customersService.create(
      email,
      password,
      fullName,
      phone,
      address,
    );
  }
  @Post(':id/update')
  async updateCustomer(
    @Param('id') id: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('fullName') fullName: string,
    @Body('address') address: string,
    @Body('phone') phone: string,
  ): Promise<{ data: Customers }> {
    return await this.customersService.updateCustomer(
      id,
      email,
      password,
      fullName,
      phone,
      address,
    );
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res: Response, // Thêm @Res() để nhận đối tượng Response
    @Req() req: Request & { session: { accessToken?: string } }, // Định nghĩa kiểu cho req với session
  ): Promise<Response> {
    return await this.customersService.login(email, password, res, req);
  }

  @Post('logout')
  async logout(@Body('id') id: string, @Res() res: Response) {
    await this.customersService.logout(id);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return res.status(200).json({ message: 'Logout thành công!' });
  }
  //async logout(
  //  @Req() req: Request & { cookies: { refreshToken?: string } },
  //  @Res() res: Response,
  //) {
  //  const refreshToken = req.cookies?.refreshToken;

  //  if (!refreshToken) {
  //    throw new BadRequestException('Missing refresh token!');
  //  }

  //  await this.customersService.logout(refreshToken);

  //  res.clearCookie('refreshToken', {
  //    httpOnly: true,
  //    sameSite: 'none',
  //    secure: true,
  //  });

  //  return res.status(200).json({ message: 'Logout thành công!' });
  //}

  @Get(':id/orders')
  @UseGuards(JwtAuthGuard) // Bảo vệ route này bằng JWT
  async orderList(
    @Param('id') customer_id: string,
    @Query('limit') limit: string,
    @Query('page') page: string,
  ) {
    return await this.ordersService.orderList(limit, page, customer_id);
  }
}
