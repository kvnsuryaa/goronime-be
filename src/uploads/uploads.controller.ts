import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) { }

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile(new ParseFilePipe({
    validators: [
      // new FileTypeValidator({ fileType: '.(jpg|jpeg|png)' }),
      // new MaxFileSizeValidator({ maxSize: 500000 }),
    ]
  })) file: Express.Multer.File) {
    return await this.uploadsService.upload(file.filename || file.originalname, file.buffer)
  }
}
