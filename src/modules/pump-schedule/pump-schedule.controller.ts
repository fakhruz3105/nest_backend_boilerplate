import { JwtAuthGuard } from '@/guards/jwt/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { NewPumpScheduleDTO } from './dto/new-pump-schedule.dto';
import { UpdatePumpScheduleDTO } from './dto/update-pump-schedule.dto';
import { PumpScheduleService } from './pump-schedule.service';

@UseGuards(JwtAuthGuard)
@Controller('pump-schedule')
export class PumpScheduleController {
  constructor(private readonly pumpScheduleService: PumpScheduleService) {}

  @Get('all')
  async scheduleList() {
    return await this.pumpScheduleService.listSchedule();
  }

  @Get('pump/state')
  async pumpState() {
    return await this.pumpScheduleService.getPumpState();
  }

  @Post('pump/toggle')
  async togglePump() {
    await this.pumpScheduleService.togglePump();
  }

  @Post()
  async newSchedule(@Body() schedule: NewPumpScheduleDTO) {
    return await this.pumpScheduleService.newSchedule(schedule);
  }

  @Put()
  async updateSchedule(@Body() schedule: UpdatePumpScheduleDTO) {
    return await this.pumpScheduleService.updateSchedule(schedule);
  }

  @Delete(':id')
  async deleteSchedule(@Param('id') id: string) {
    await this.pumpScheduleService.deleteSchedule(id);
  }
}
