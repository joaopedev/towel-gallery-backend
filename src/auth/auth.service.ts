import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { AdminUser } from './admin-user.entity';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(AdminUser)
    private readonly adminUsersRepository: Repository<AdminUser>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const username = this.configService.getOrThrow<string>('ADMIN_USERNAME');
    const password = this.configService.getOrThrow<string>('ADMIN_PASSWORD');
    const existing = await this.adminUsersRepository.findOne({
      where: { username },
    });
    const passwordHash = await bcrypt.hash(password, 10);

    if (!existing) {
      await this.adminUsersRepository.save({
        username,
        passwordHash,
      });
      return;
    }

    if (!(await bcrypt.compare(password, existing.passwordHash))) {
      existing.passwordHash = passwordHash;
      await this.adminUsersRepository.save(existing);
    }
  }

  async login(input: LoginDto) {
    const admin = await this.adminUsersRepository.findOne({
      where: { username: input.username },
    });

    if (!admin) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const passwordMatches = await bcrypt.compare(
      input.password,
      admin.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: admin.id,
      username: admin.username,
    });

    return {
      accessToken,
      user: {
        id: admin.id,
        username: admin.username,
      },
    };
  }
}
