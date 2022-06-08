import { Controller, Get, Param } from '@nestjs/common';

@Controller('users')
export class UserController {
  @Get(':id')
  test(@Param('id') id: string) {
    return id;
  }
}
