import { getUserByEmail } from "../../models/user.js";
import s3 from "../../utils/storage.js";

const getProfileImage = async (email) => {
  const user = await getUserByEmail(email);
  const data = await s3
    .getObject({
      Bucket: "profile",
      Key: `${user.id}.jpg`,
    })
    .promise();
  return data.Body;
};

export default getProfileImage;
