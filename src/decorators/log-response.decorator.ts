import { Inject, Logger } from '@nestjs/common';

export function LogResponse() {
  const injectLogger = Inject(Logger);

  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    injectLogger(target, 'logger'); // constructor(private readonly logger: Logger) {}
    // Keep the original method reference
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);
      const logger: Logger = this.logger;
      logger.log(`**** Response for ${key}:`, result, ' ****');
      logger.error(`**** Response for ${key}:`, result, ' ****');
      logger.verbose(`**** Response for ${key}:`, result, ' ****');
      logger.fatal(`**** Response for ${key}:`, result, ' ****');
      logger.warn(`**** Response for ${key}:`, result, ' ****');
      console.info(`**** Response for ${key}:`, result, ' ****');
      return result;
    };
    return descriptor;
  };
}
