import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('uploads')
export class UploadsController {
    private readonly logger = new Logger(UploadsController.name);

    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
                return cb(new BadRequestException('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024, // 5MB
        },
    }))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            this.logger.error('Upload attempt failed: No file provided');
            throw new BadRequestException('File is required');
        }
        // Return the relative path
        const fileUrl = `/uploads/${file.filename}`;
        this.logger.log(`File uploaded successfully: ${fileUrl}`);
        return { url: fileUrl };
    }
}
