export function ConsoleLogResponse() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);
      console.info(`**** Response for ${key}:`, result, ' ****');
      return result;
    };
    return descriptor;
  };
}
