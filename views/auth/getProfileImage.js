import getProfileImageFunction from "../../controllers/auth/getProfileImage.js";

const getProfileImage = async (req, res) => {
  try {
    const email = res.locals.email;
    const result = await getProfileImageFunction(email);

    res.header("Content-Type", "image/png");
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Immagine non trovata" });
  }
};

export default getProfileImage;
