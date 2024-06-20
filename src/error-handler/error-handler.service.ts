import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class ErrorHandlerService {
  constructor(private readonly logger: Logger) {}

  handle(error: any) {
    console.log(
      '==========================',
      Object.prototype.toString.call(error),
    );
    if (error?.code) {
      switch (error.code) {
        case '23505':
          throw new BadRequestException(error?.detail || '');
      }
    }

    if (error?.status) {
      switch (error.status) {
        case 400:
          throw new BadRequestException(error?.message || '');
        case 404:
          throw new NotFoundException(error?.message || '');
      }
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
