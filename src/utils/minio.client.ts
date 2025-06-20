import { Client } from 'minio'

export const minioClient = new Client({
  endPoint: '1.2.3.14',
  port: 9000,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin'
})
export const bucketName = 'my-baby-memories'
