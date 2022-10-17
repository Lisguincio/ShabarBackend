import nodemailer from "nodemailer";
import ejs from "ejs";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT || 587,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (
  email,
  subject,
  emailParams = {
    title: "Titolo Mail",
    body: `Questo é il testo della mail`,
    button_main_text: "Testo del pulsante principale",
    button_main_link: `https://${process.env.RAILWAY_STATIC_URL}/LINKPULSANTEPRINCIPALE`,
  }
) => {
  try {
    const body = await ejs.renderFile("./templates/email-template.ejs", {
      ...emailParams,
    });

    const message = {
      from: `"ShabarApp 🍸" <info@shabarapp.it>`,
      to: email,
      subject: `ShabarApp - ${subject}`,
      html: body,
    };

    const mailResponse = await transporter.sendMail(message);

    if (mailResponse.response.split(" ")[0] == "250") {
      return { message: "Email inviata con successo" };
    } else throw { status: 500, message: mailResponse.response };
  } catch (error) {
    throw { status: error.status || 500, message: error.message };
  }
};

export default transporter;
