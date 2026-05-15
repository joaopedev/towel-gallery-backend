import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

@Injectable()
export class StorageService {
  private readonly driver: 'local' | 's3';
  private readonly s3Client?: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.driver = this.configService.get<'local' | 's3'>('STORAGE_DRIVER')!;

    if (this.driver === 's3') {
      this.s3Client = new S3Client({
        region: this.configService.getOrThrow<string>('AWS_REGION'),
        credentials: {
          accessKeyId:
            this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
          secretAccessKey: this.configService.getOrThrow<string>(
            'AWS_SECRET_ACCESS_KEY',
          ),
        },
      });
    }
  }

  async uploadImage(file: Express.Multer.File) {
    const extension = extname(file.originalname) || '.jpg';
    const fileName = `${randomUUID()}${extension}`;

    if (this.driver === 's3' && this.s3Client) {
      const bucket = this.configService.getOrThrow<string>('AWS_S3_BUCKET');
      const key = `gallery/${fileName}`;
      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        },
      });

      await upload.done();

      const publicBaseUrl =
        this.configService.get<string>('AWS_S3_PUBLIC_BASE_URL') ??
        `https://${bucket}.s3.${this.configService.getOrThrow<string>(
          'AWS_REGION',
        )}.amazonaws.com`;

      return {
        url: `${publicBaseUrl}/${key}`,
      };
    }

    const uploadsDirectory = join(process.cwd(), 'uploads');
    await mkdir(uploadsDirectory, { recursive: true });
    await writeFile(join(uploadsDirectory, fileName), file.buffer);

    return {
      url: `/uploads/${fileName}`,
    };
  }
}
