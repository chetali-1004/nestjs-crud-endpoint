import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Get,
  Query,
} from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherDto } from './dto';

@Controller('voucher')
export class VoucherController {
  constructor(private voucherService: VoucherService) {}

  // Create a new voucher
  @Post('create')
  createVoucher(@Body() dto: VoucherDto) {
    return this.voucherService.createVoucher(dto);
  }

  // Update an existing voucher
  @Patch('update/:code')
  updateVoucher(@Param('code') code: string, @Body() dto: VoucherDto) {
    return this.voucherService.updateVoucher(code, dto);
  }

  // Delete a voucher by its code
  @Delete('delete/:code')
  deleteVoucher(@Param('code') code: string) {
    return this.voucherService.deleteVoucher(code);
  }

  // Retrieve all vouchers (or a specific one if needed)
  @Get('all')
  getAllVouchers() {
    return this.voucherService.getAllVouchers();
  }

  // Retrieve a specific voucher by its code
  @Get(':code')
  getVoucherByCode(@Param('code') code: string) {
    return this.voucherService.getVoucherByCode(code);
  }
}
