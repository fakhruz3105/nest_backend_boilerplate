import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { UserRole } from '../user.entity';

export class UpdateUserDTO {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsNumber()
  role?: UserRole;
}
