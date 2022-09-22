import nodemailer from "nodemailer";
import ejs from "ejs";

const sendEmail = async (email, subject, emailParams) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    ejs.renderFile(
      "./views/email-template.ejs",
      { ...emailParams },
      (error, data) => {
        if (error) {
          console.log(error);
        } else {
          //console.log(data);
          let message = {
            from: `"ShabarApp 🍸" <shabarapp@gmail.com>`,
            to: email,
            subject: `ShabarApp - ${subject}`,
            html: data,
          };

          transporter.sendMail(message, (err) => {
            if (err) console.log(err);
            else console.log("Messaggio inviato!");
          });
        }
      }
    );
  } catch (error) {
    return error;
  }
};

export default sendEmail;
