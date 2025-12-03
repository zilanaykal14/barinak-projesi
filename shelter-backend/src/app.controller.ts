import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // --- RESİM YÜKLEME ENDPOINT'İ ---
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // Dosyalar buraya kaydedilecek
      filename: (req, file, cb) => {
        // Dosya ismini rastgele yap (Çakışma olmasın)
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    // Yükleme bitince Frontend'e resmin yeni adresini dön
    return { url: `http://127.0.0.1:3333/uploads/${file.filename}` };
  }
}