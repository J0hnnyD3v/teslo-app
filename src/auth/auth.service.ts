import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from 'src/user/dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { HandleError } from 'src/decorators/error-handler.decorator';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private _saltOrRounds = 10;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  @HandleError()
  async signup(createUserDto: CreateUserDto) {
    const password = createUserDto.password;
    const hash = await bcrypt.hash(password, this._saltOrRounds);
    createUserDto.password = hash;

    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);

    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;

    return {
      ...user,
      access_token: await this.getJsonWebToken({
        id: user.id,
        email: user.email,
        fullName: `${user.firstName} ${user.lastName}`,
      }),
    };
  }

  @HandleError()
  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true, firstName: true, lastName: true },
    });

    if (!user) throw new UnauthorizedException('Wrong Credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Wrong Credentials');

    delete user.password;
    return {
      ...user,
      access_token: await this.getJsonWebToken({
        id: user.id,
        email: user.email,
        fullName: `${user.firstName} ${user.lastName}`,
      }),
    };
  }

  async checkUserTokenStatus(user: User) {
    return {
      ...user,
      access_token: await this.getJsonWebToken({
        id: user.id,
        email: user.email,
        fullName: `${user.firstName} ${user.lastName}`,
      }),
    };
  }

  private async getJsonWebToken(payload: IJwtPayload) {
    return await this.jwtService.signAsync(payload);
  }
}
