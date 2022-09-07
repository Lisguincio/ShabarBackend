import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECTID,
  keyFilename: process.env.GCLOUD_KEYFILENAME,
});

const bucket = storage.bucket(process.env.GCLOUD_BUCKET);

export const downloadFile = async (path, res) => {
  await bucket.file(path).createReadStream().pipe(res);
};
