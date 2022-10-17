import s3 from "../../utils/storage.js";
import { getUserByEmail } from "../../models/user.js";

const postProfileImage = async (email, files) => {
  const user = await getUserByEmail(email);
  const { id } = user;

  if (!files || Object.keys(files).length === 0) {
    throw { status: 400, message: "No files were uploaded." };
  }
  const file = files.file;
  console.log(file);
  const params = {
    Bucket: "profile",
    Key: `${id}.jpg`,
    Body: file.data,
  };
  await s3.upload(params).promise();
  return { message: "Immagine caricata" };
};

export default postProfileImage;
