import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  public password: string;
}
