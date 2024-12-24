import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Import your Prisma service
import { VoucherDto } from './dto';

@Injectable()
export class VoucherService {
  constructor(private prisma: PrismaService) {}

  // Create a new voucher
  async createVoucher(dto: VoucherDto) {
    const existingVoucher = await this.prisma.voucher.findUnique({
      where: { code: dto.code },
    });

    if (existingVoucher) {
      throw new Error(`Voucher with code ${dto.code} already exists.`);
    }

    return await this.prisma.voucher.create({
      data: {
        code: dto.code,
        discount: dto.discount,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
      },
    });
  }

  // Update an existing voucher by its code
  async updateVoucher(code: string, dto: VoucherDto) {
    const existingVoucher = await this.prisma.voucher.findUnique({
      where: { code },
    });

    if (!existingVoucher) {
      throw new NotFoundException(`Voucher with code ${code} not found.`);
    }

    return await this.prisma.voucher.update({
      where: { code },
      data: {
        discount: dto.discount,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
      },
    });
  }

  // Delete a voucher by its code
  async deleteVoucher(code: string) {
    const existingVoucher = await this.prisma.voucher.findUnique({
      where: { code },
    });

    if (!existingVoucher) {
      throw new NotFoundException(`Voucher with code ${code} not found.`);
    }

    await this.prisma.voucher.delete({
      where: { code },
    });

    return { message: `Voucher with code ${code} deleted successfully.` };
  }

  // Retrieve all vouchers
  async getAllVouchers() {
    return await this.prisma.voucher.findMany();
  }

  // Retrieve a specific voucher by its code
  async getVoucherByCode(code: string) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { code },
    });

    if (!voucher) {
      throw new NotFoundException(`Voucher with code ${code} not found.`);
    }

    return voucher;
  }
}
