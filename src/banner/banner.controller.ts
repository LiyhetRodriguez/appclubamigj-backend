import { Controller, Get, Put, Body, Post, UploadedFile, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { BannerService } from './banner.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Controller('banner')
export class BannerController {
  constructor(private readonly service: BannerService) {}

  @Get()
  async get() {
    return this.service.getBanner();
  }

  @Put()
  async set(@Body() body: { url?: string | null }) {
    const url = body?.url ?? null;
    return this.service.setBanner(url);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {3
          const uploadPath = join(process.cwd(), 'backend', 'public', 'uploads');
          if (!existsSync(uploadPath)) mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const name = Date.now();
          const fileExt = extname(file.originalname);
          cb(null, `${name}${fileExt}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // accept images only
        if (!file.mimetype.match(/image\//)) {
          return cb(new HttpException('Only image files are allowed!', HttpStatus.BAD_REQUEST), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    }),
  )
  async upload(@UploadedFile() file: any) {
    if (!file) throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    // Build a URL to access the uploaded file
    const port = process.env.PORT ?? '3000';
    const host = process.env.SITE_URL ?? `http://localhost:${port}`;
    const url = `${host}/uploads/${file.filename}`;
    // Also set as current banner
    await this.service.setBanner(url);
    return { url };
  }
}
