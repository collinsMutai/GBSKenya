const Contact = require("../models/Contact");
const transporter = require("../config/mailer");

exports.sendContact = async (req, res) => {
  const { name, email, type, message } = req.body;

  const contact = await Contact.create({
    name,
    email,
    type,
    message,
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.RECEIVER_EMAIL,
    subject: `New Contact Form (${type})`,
    html: `
            <h2>New Contact Form</h2>

            <p><strong>Name:</strong> ${name}</p>

            <p><strong>Email:</strong> ${email}</p>

            <p><strong>Type:</strong> ${type}</p>

            <p><strong>Message:</strong></p>

            <p>${message}</p>
        `,
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "We've received your message",
    html: `
        <h2>Hello ${name},</h2>

        <p>Thank you for contacting GBS Foundation Kenya.</p>

        <p>We have received your message and will respond as soon as possible.</p>

        <br>

        <p>Regards,</p>

        <strong>GBS Foundation Kenya</strong>
        `,
  });

  res.status(201).json({
    success: true,
    message: "Message sent successfully.",
    data: contact,
  });
};
