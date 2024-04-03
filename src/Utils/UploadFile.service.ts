import { S3 } from 'aws-sdk';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class FileUploadService {
    constructor() { }


    bucketName = process.env.AWT_BUCKET_NAME

    s3 = new S3({
        accessKeyId: process.env.AWS_SDK_ACCESS_ID,
        secretAccessKey: process.env.AWS_SDK_SECRET_KEY,
    })
    async uploadSingleFile(dataBuffer: Buffer, filename: String) {
        try {
            const uploadResult = await this.s3.upload({
                Bucket: this.bucketName,
                Body: dataBuffer,
                Key: `${filename}`,
                // ACL: 'public-read',
                ContentDisposition: 'inline',

            })
                .promise();

            return uploadResult
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }

    }

}