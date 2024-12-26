import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Import your Prisma service
import { VoucherDto } from './dto';
import { Voucher } from '@prisma/client';

@Injectable()
export class VoucherService {
  private readonly logger = new Logger(VoucherService.name);
  constructor(private prisma: PrismaService) {}

  // Create a new voucher
  async createVoucher(dto: VoucherDto): Promise<Voucher> {
    const existingVoucher = await this.prisma.voucher.findUnique({
      where: {
        code: dto.code,
      },
    });

    if (existingVoucher) {
      this.logger.warn(`Voucher with code ${dto.code} already exists.`);
      throw new ConflictException(
        `Voucher with code ${dto.code} already exists.`,
      );
    }

    if (!this.isValidVoucher(dto)) {
      this.logger.error(`Invalid date range for voucher code : ${dto.code}`);
      throw new ConflictException(
        `Invalid date range for voucher code : ${dto.code}`,
      );
    }

    try {
      const createVoucher = await this.prisma.voucher.create({
        data: {
          code: dto.code,
          discount: dto.discount,
          startDate: new Date(dto.startDate),
          endDate: new Date(dto.endDate),
        },
      });

      this.logger.log(`Voucher with code ${dto.code} created successfully.`);
      return createVoucher;
    } catch (error) {
      this.logger.error(
        `Error creating voucher : ${error.message}`,
        error.stack,
      );
      throw new Error('Failed to create voucher.');
    }
  }

  // Update an existing voucher by its code
  async updateVoucher(code: string, dto: VoucherDto): Promise<Voucher> {
    const existingVoucher = await this.prisma.voucher.findUnique({
      where: { code },
    });

    if (!existingVoucher) {
      this.logger.warn(`Voucher with code ${code} not found.`);
      throw new NotFoundException(`Voucher with code ${code} not found.`);
    }

    if (!this.isValidVoucher(dto)) {
      this.logger.error(`Invalid date range for voucher code : ${dto.code}`);
      throw new ConflictException(
        `Invalid date range for voucher code : ${dto.code}`,
      );
    }

    try {
      const updatedVoucher = await this.prisma.voucher.update({
        where: { code },
        data: {
          discount: dto.discount,
          startDate: new Date(dto.startDate),
          endDate: new Date(dto.endDate),
        },
      });

      this.logger.log(`Voucher with code ${code} updated successfully.`);
      return updatedVoucher;
    } catch (error) {
      this.logger.error(
        `Error updating voucher: ${error.message}`,
        error.stack,
      );
      throw new Error('Failed to update voucher. Please try again later.');
    }
  }

  // Delete a voucher by its code
  async deleteVoucher(code: string): Promise<{ message: string }> {
    const existingVoucher = await this.prisma.voucher.findUnique({
      where: { code },
    });

    if (!existingVoucher) {
      this.logger.warn(`Voucher with code ${code} not found.`);
      throw new NotFoundException(`Voucher with code ${code} not found.`);
    }

    try {
      await this.prisma.voucher.delete({
        where: { code },
      });

      this.logger.log(`Voucher with code ${code} deleted successfully.`);
      return { message: `Voucher with code ${code} deleted successfully.` };
    } catch (error) {
      this.logger.error(
        `Error deleting voucher: ${error.message}`,
        error.stack,
      );
      throw new Error('Failed to delete voucher. Please try again later.');
    }
  }

  // Retrieve all vouchers
  async getAllVouchers(): Promise<Voucher[]> {
    try {
      const vouchers = await this.prisma.voucher.findMany({
        orderBy: { startDate: 'asc' },
      });

      this.logger.log(`Successfully retrieved ${vouchers.length} vouchers.`);
      return vouchers;
    } catch (error) {
      this.logger.error(
        `Error retrieving vouchers: ${error.message}`,
        error.stack,
      );
      throw new Error('Failed to retrieve vouchers. Please try again later.');
    }
  }

  // Retrieve a specific voucher by its code
  async getVoucherByCode(code: string): Promise<Voucher> {
    try {
      const voucher = await this.prisma.voucher.findUnique({
        where: { code },
      });

      if (!voucher) {
        this.logger.warn(`Voucher with code ${code} not found.`);
        throw new NotFoundException(`Voucher with code ${code} not found.`);
      }

      this.logger.log(`Successfully retrieved voucher with code: ${code}`);
      return voucher;
    } catch (error) {
      this.logger.error(
        `Error retrieving voucher: ${error.message}`,
        error.stack,
      );
      throw new Error('Failed to retrieve voucher. Please try again later.');
    }
  }

  // Check if a voucher is valid
  isValidVoucher(dto: VoucherDto) {
    const currentDate = new Date();
    if (
      new Date(dto.startDate) < currentDate ||
      new Date(dto.endDate) < currentDate
    ) {
      return false;
    }
    if (new Date(dto.startDate) > new Date(dto.endDate)) {
      return false;
    }
    return true;
  }
}
