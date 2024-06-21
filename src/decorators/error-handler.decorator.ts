import { Inject } from '@nestjs/common';
import { ErrorHandlerService } from 'src/error-handler/error-handler.service';

export function HandleError() {
  const injectErrorHandlerService = Inject(ErrorHandlerService);

  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    // this is the same as using constructor(private readonly logger: LoggerService) in a class
    injectErrorHandlerService(target, 'errorHandlerService');

    // Keep the original method reference
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error: any) {
        if (this?.queryRunner && this?.queryRunner?.isTransactionActive) {
          this.queryRunner.rollbackTransaction();
          this.queryRunner.release();
        }
        const errorHandlerService: ErrorHandlerService = this.errorHandlerService;
        errorHandlerService.handle(error);

        throw error;
      }
    };
    return descriptor;
  };
}
