const Contact = require("../models/Contact");
const transporter = require("../config/mailer");

exports.sendContact = async (req, res) => {
  try {
    const { name, email, type, message } = req.body;

    // Save contact request
    const contact = await Contact.create({
      name,
      email,
      type,
      message,
    });

    const year = new Date().getFullYear();
    const website = "https://gbs-cidpkenya.org";

    // =====================================================
    // ADMIN NOTIFICATION EMAIL
    // =====================================================
    await transporter.sendMail({
      from: `"GBS | CIDP Kenya Chapter" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission - ${type}`,
      html: `
      <div style="margin:0;padding:40px;background:#FAF7EF;font-family:Arial,'Helvetica Neue',sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:720px;margin:auto;background:#ffffff;border:1px solid #EDE7D8;border-radius:16px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#072A4A;padding:40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:30px;font-weight:700;">
                GBS | CIDP Kenya Chapter
              </h1>

              <p style="margin:12px 0 0;color:#EDE7D8;font-size:15px;">
                New Contact Form Submission
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:35px;">

              <p style="margin:0 0 25px;color:#4B5563;font-size:16px;">
                A new inquiry has been submitted through the website contact form.
              </p>

              <table width="100%" cellpadding="12" cellspacing="0" style="border-collapse:collapse;border:1px solid #EDE7D8;border-radius:10px;overflow:hidden;">

                <tr style="background:#FAF7EF;">
                  <td width="180"><strong>Name</strong></td>
                  <td>${name}</td>
                </tr>

                <tr>
                  <td><strong>Email</strong></td>
                  <td>${email}</td>
                </tr>

                <tr style="background:#FAF7EF;">
                  <td><strong>Inquiry Type</strong></td>
                  <td>${type}</td>
                </tr>

              </table>

              <div style="margin-top:30px;background:#FAF7EF;border-left:5px solid #2E9E68;padding:22px;border-radius:10px;">

                <h3 style="margin:0 0 15px;color:#072A4A;">
                  Message
                </h3>

                <p style="margin:0;color:#4B5563;line-height:1.8;white-space:pre-line;">
                  ${message}
                </p>

              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#072A4A;padding:25px;text-align:center;">

              <p style="margin:0;color:#ffffff;font-weight:bold;">
                GBS | CIDP Kenya Chapter
              </p>

              <p style="margin:10px 0;color:#EDE7D8;">
                Support • Hope • Recovery
              </p>

              <a href="${website}" style="color:#2E9E68;text-decoration:none;font-weight:bold;">
                ${website}
              </a>

              <p style="margin-top:18px;color:#EDE7D8;font-size:12px;">
                © ${year} GBS | CIDP Kenya Chapter. All Rights Reserved.
              </p>

            </td>
          </tr>

        </table>

      </div>
      `,
    });

    // =====================================================
    // AUTO REPLY EMAIL
    // =====================================================
    await transporter.sendMail({
      from: `"GBS | CIDP Kenya Chapter" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for contacting GBS | CIDP Kenya Chapter",
      html: `
      <div style="margin:0;padding:40px;background:#FAF7EF;font-family:Arial,'Helvetica Neue',sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:720px;margin:auto;background:#ffffff;border:1px solid #EDE7D8;border-radius:16px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#072A4A;padding:45px;text-align:center;">

              <h1 style="margin:0;color:#ffffff;font-size:32px;">
                Thank You
              </h1>

              <p style="margin-top:12px;color:#EDE7D8;font-size:16px;">
                Your message has been received successfully.
              </p>

            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <h2 style="margin:0 0 20px;color:#111;">
                Hello ${name},
              </h2>

              <p style="margin:0 0 18px;color:#4B5563;line-height:1.8;">
                Thank you for contacting the
                <strong style="color:#072A4A;">GBS | CIDP Kenya Chapter</strong>.
              </p>

              <p style="margin:0 0 18px;color:#4B5563;line-height:1.8;">
                We appreciate you taking the time to reach out. Your inquiry has been received successfully and a member of our team will respond as soon as possible.
              </p>

              <p style="margin:0 0 30px;color:#4B5563;line-height:1.8;">
                We are committed to supporting individuals and families affected by Guillain-Barré Syndrome (GBS), Chronic Inflammatory Demyelinating Polyneuropathy (CIDP), and related neurological conditions across Kenya.
              </p>

              <div style="background:#FAF7EF;border-left:5px solid #2E9E68;padding:22px;border-radius:10px;">

                <h3 style="margin:0 0 15px;color:#072A4A;">
                  Your Submission
                </h3>

                <p style="margin:8px 0;color:#4B5563;">
                  <strong>Name:</strong> ${name}
                </p>

                <p style="margin:8px 0;color:#4B5563;">
                  <strong>Email:</strong> ${email}
                </p>

                <p style="margin:8px 0;color:#4B5563;">
                  <strong>Inquiry Type:</strong> ${type}
                </p>

                <div style="margin-top:20px;padding:18px;background:#ffffff;border:1px solid #EDE7D8;border-radius:10px;">

                  <strong style="color:#072A4A;">Your Message</strong>

                  <p style="margin-top:12px;color:#4B5563;line-height:1.8;white-space:pre-line;">
                    ${message}
                  </p>

                </div>

              </div>

              <div style="text-align:center;margin-top:35px;">

                <a href="${website}"
                  style="
                    display:inline-block;
                    background:#2E9E68;
                    color:#ffffff;
                    text-decoration:none;
                    padding:15px 34px;
                    border-radius:999px;
                    font-weight:bold;
                    font-size:15px;
                  ">
                  Visit Our Website
                </a>

              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#072A4A;padding:30px;text-align:center;">

              <h3 style="margin:0;color:#ffffff;">
                GBS | CIDP Kenya Chapter
              </h3>

              <p style="margin:10px 0;color:#EDE7D8;">
                Support • Hope • Recovery
              </p>

              <p style="margin:0;">
                <a href="${website}" style="color:#2E9E68;text-decoration:none;font-weight:bold;">
                  ${website}
                </a>
              </p>

              <p style="margin:18px 0 0;color:#EDE7D8;font-size:12px;">
                © ${year} GBS | CIDP Kenya Chapter. All Rights Reserved.
              </p>

            </td>
          </tr>

        </table>

      </div>
      `,
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: contact,
    });
  } catch (error) {
    console.error("Contact Form Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending your message.",
    });
  }
};
