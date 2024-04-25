import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk'

@Injectable()
export class UploadsService {
    constructor(private readonly config: ConfigService) { }

    private AWSUpload(filename: string, file: Buffer) {
        return new Promise((resolve, reject) => {
            try {
                const spacesEndpoint = new AWS.Endpoint(this.config.getOrThrow('S3_ENDPOINT'));
                const spaceClient = new AWS.S3({
                    region: 'sgp1',
                    s3ForcePathStyle: true,
                    endpoint: spacesEndpoint,
                    credentials: new AWS.Credentials({
                        accessKeyId: this.config.getOrThrow('S3_ACCESS_KEY'),
                        secretAccessKey: this.config.getOrThrow('S3_SECRET_KEY')
                    })
                })

                const fileName = `${Date.now()}-${filename}`;
                const spaceRequest: AWS.S3.PutObjectRequest = {
                    Bucket: 'goronime',
                    Key: fileName,
                    ACL: 'public-read',
                    Body: file
                }

                spaceClient.putObject(spaceRequest, (err, data) => {
                    if (err) return reject(err)
                    const url_file = `${spacesEndpoint.href}goronime/${fileName}`
                    return resolve(url_file)
                })
            } catch (err) {
                return reject(err)
            }
        })
    }

    async upload(filename: string, file: Buffer) {
        const upload_method = this.config.getOrThrow('UPLOAD_METHOD')
        if (upload_method === 'DO') {
            const url = await this.AWSUpload(filename, file)
            return url
        }
    }
}
