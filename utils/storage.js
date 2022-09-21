import S3 from "aws-sdk/clients/s3.js";

const s3 = new S3({
  accessKeyId: process.env.STRORJ_ACCESSKEY_ID,
  secretAccessKey: process.env.STRORJ_SECRET_ACCESSKEY,
  endpoint: process.env.STRORJ_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
  connectTimeout: 0,
  httpOptions: { timeout: 0 },
});

export default s3;
