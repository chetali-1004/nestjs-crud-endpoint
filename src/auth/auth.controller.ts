import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }

  @Patch('updateUser')
  updateUser(@Body() dto: AuthDto) {
    return this.authService.updateUser(dto);
  }

  @Delete('deleteUser')
  deleteUser(@Body() dto: AuthDto) {
    return this.authService.deleteUser(dto.email);
  }
}
