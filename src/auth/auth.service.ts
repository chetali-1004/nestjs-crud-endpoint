import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  //create endpoint
  async signup(dto: AuthDto) {
    //generate the password hash
    const hash = await argon.hash(dto.password);

    //save the new user in the db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      delete user.hash; //to avoid returning the hash

      //return the saved user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials Taken');
        }
      }
      throw error;
    }
  }

  //read endpoint
  async signin(dto: AuthDto) {
    // check whether user exists
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if user does not exist, throw an exception
    if (!user) throw new ForbiddenException('Credentials do not exist');

    //compare passwords
    const pwMatches = await argon.verify(user.hash, dto.password);

    //if passwords do not match, throw an exception
    if (!pwMatches) throw new ForbiddenException('Invalid Credentials');

    //if passwords match, send back user
    delete user.hash;
    return user;
  }

  async updateUser(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new NotFoundException('User not found');
    const hash = await argon.hash(dto.password);
    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { email: dto.email },
      data: {
        hash,
      },
    });
    delete updatedUser.hash; // Avoid returning the hash
    return updatedUser;
  }

  async deleteUser(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.delete({ where: { email } });
    return { message: 'User deleted successfully' };
  }
}
