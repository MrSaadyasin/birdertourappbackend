/// <reference types="node" />
import { S3 } from 'aws-sdk';
export declare class FileUploadService {
    constructor();
    bucketName: string;
    s3: S3;
    uploadSingleFile(dataBuffer: Buffer, filename: String): Promise<S3.ManagedUpload.SendData>;
}
