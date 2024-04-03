import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as multer from 'multer';

@Injectable()
export class FilesInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();

    await new Promise<void>((resolve, reject) =>

      multer().fields([{ name: 'video', maxCount: 1 },
      { name: 'images', maxCount: 10 },
      { name: 'profile_image', maxCount: 1 },
      { name: 'banner_image', maxCount: 1 },
      { name: 'documents', maxCount: 20 }])(req, ctx.getResponse(), (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      }),
    );

    return next.handle();
  }
}