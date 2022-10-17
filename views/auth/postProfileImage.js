import postProfileImageFunction from "../../controllers/auth/postProfileImage.js";

const postProfileImage = async (req, res) => {
  try {
    const email = res.locals.email;
    const files = req.files;
    const result = await postProfileImageFunction(email, files);
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(error.status || 500).json({ message: error.message });
  }
};

export default postProfileImage;
