import nodemailer from "nodemailer";
import ejs from "ejs";

const sendEmail = async (email, subject, emailTitle, emailBody) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD, // naturally, replace both with your real credentials or an application-specific password
      },
    });

    /* transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    }); */

    ejs.renderFile(
      "./views/email-template.ejs",
      { title: emailTitle, message: emailBody },
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
            //html: `<html><body><p>${emailBody}</p></body></html>`,
          };

          //console.log("HTML DATA =============> ", message.html);

          transporter.sendMail(message, (err) => {
            if (err) console.log(err);
            else console.log("Messaggio inviato!");
          });
        }
      }
    );

    /* const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const compiledTemplate = handlebars.compile(source);
    const options = () => {
      return {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: subject,
        html: compiledTemplate(payload),
      };
    };

    // Send email
    transporter.sendMail(options(), (error, info) => {
      if (error) {
        return error;
      } else {
        return res.status(200).json({
          success: true,
        });
      }
    });*/
  } catch (error) {
    return error;
  }
};

/*
Example:
sendEmail(
  "youremail@gmail.com,
  "Email subject",
  { name: "Eze" },
  "./templates/layouts/main.handlebars"
);
*/

export default sendEmail;
