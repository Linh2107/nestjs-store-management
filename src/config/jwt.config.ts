import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: (): JwtModuleOptions => ({
    secret: process.env.APP_SECRET,
    signOptions: {
      expiresIn: process.env.EXPIRESIN,
    },
  }),
};
