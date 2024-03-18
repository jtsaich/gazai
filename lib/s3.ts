import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const client = new S3Client({ region: 'ap-northeast-1' });
const bucketName = 'gazai';

export const getObject = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key
  });

  try {
    const response = await client.send(command);
    if (response.Body === undefined) throw new Error('No body');

    // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
    return await response.Body.transformToByteArray();
  } catch (err) {
    console.error(err);
  }
};

export const uploadObject = async (base64Image: string, key?: string) => {
  const imageBuffer = Buffer.from(base64Image, 'base64');
  const objectKey = key || uuidv4();
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    Body: imageBuffer,
    ContentEncoding: 'base64',
    ContentType: 'image/png'
  });

  try {
    const response = await client.send(command);
    console.debug(response);
    // return response;
  } catch (err) {
    console.error(err);
  }
};
