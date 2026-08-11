const Newsletter = require("../models/Newsletter");
const transporter = require("../config/mailer");

const WEBSITE_URL = process.env.WEBSITE_URL;
const API_URL = process.env.API_URL;

if (!WEBSITE_URL || !API_URL) {
throw new Error(
"WEBSITE_URL and API_URL must be configured in environment variables."
);
}



exports.subscribe = async (req, res) => {
try {
const { email } = req.body;


if (!email) {
  return res.status(400).json({
    success: false,
    message: "Email is required.",
  });
}

const normalizedEmail = email.toLowerCase().trim();

const existing = await Newsletter.findOne({
  email: normalizedEmail,
});

if (existing) {
  if (!existing.active) {
    existing.active = true;
    await existing.save();

    return res.status(200).json({
      success: true,
      message: "Your subscription has been restored.",
    });
  }

  return res.status(409).json({
    success: false,
    message: "You're already subscribed.",
  });
}

const subscriber = await Newsletter.create({
  email: normalizedEmail,
  active: true,
});

const year = new Date().getFullYear();

const unsubscribeUrl =
  `${API_URL}/api/newsletter/unsubscribe/${subscriber.unsubscribeToken}`;

/*
|--------------------------------------------------------------------------
| Admin Notification
|--------------------------------------------------------------------------
*/

await transporter.sendMail({
  from: `"GBS | CIDP Kenya Chapter" <${process.env.EMAIL_USER}>`,
  to: process.env.EMAIL_USER,
  subject: "New Newsletter Subscription",

  html: `
    <div style="background:#FAF7EF;padding:40px;font-family:Arial,sans-serif;">
      <table
        width="100%"
        style="
          max-width:650px;
          margin:auto;
          background:#fff;
          border-radius:14px;
          overflow:hidden;
          border:1px solid #EDE7D8;
        "
      >
        <tr>
          <td style="background:#072A4A;padding:35px;text-align:center;">
            <h1 style="color:#fff;margin:0;">
              New Subscriber
            </h1>

            <p style="color:#EDE7D8;">
              GBS | CIDP Kenya Chapter Newsletter
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:35px;">
            <p>
              A new person subscribed to your newsletter.
            </p>

            <div
              style="
                background:#FAF7EF;
                padding:20px;
                border-left:5px solid #2E9E68;
                border-radius:10px;
              "
            >
              <strong>Email:</strong>

              <p>
                ${normalizedEmail}
              </p>
            </div>
          </td>
        </tr>

        <tr>
          <td
            style="
              background:#072A4A;
              padding:20px;
              text-align:center;
              color:#fff;
              font-size:13px;
            "
          >
            © ${year} GBS | CIDP Kenya Chapter
          </td>
        </tr>
      </table>
    </div>
  `,
});

/*
|--------------------------------------------------------------------------
| Welcome Email
|--------------------------------------------------------------------------
*/

await transporter.sendMail({
  from: `"GBS | CIDP Kenya Chapter" <${process.env.EMAIL_USER}>`,
  to: normalizedEmail,
  subject: "Welcome to GBS | CIDP Kenya Chapter Newsletter",

  html: `
    <div style="background:#FAF7EF;padding:40px;font-family:Arial,sans-serif;">

      <table
        width="100%"
        style="
          max-width:700px;
          margin:auto;
          background:#fff;
          border-radius:14px;
          overflow:hidden;
          border:1px solid #EDE7D8;
        "
      >

        <tr>
          <td style="background:#072A4A;padding:40px;text-align:center;">

            <h1 style="color:#fff;margin:0;">
              Welcome!
            </h1>

            <p style="color:#EDE7D8;">
              Thank you for joining our community.
            </p>

          </td>
        </tr>

        <tr>
          <td style="padding:40px;">

            <p style="color:#4B5563;line-height:1.8;">
              Thank you for subscribing to the

              <strong style="color:#072A4A;">
                GBS | CIDP Kenya Chapter
              </strong>

              newsletter.
            </p>

            <p style="color:#4B5563;line-height:1.8;">
              You will receive:
            </p>

            <ul style="color:#4B5563;line-height:2;">
              <li>Patient education resources</li>
              <li>GBS & CIDP awareness updates</li>
              <li>Community events</li>
              <li>Support resources</li>
              <li>Chapter announcements</li>
            </ul>

            <div style="text-align:center;margin-top:35px;">

              <a
                href="${WEBSITE_URL}"
                style="
                  background:#2E9E68;
                  color:white;
                  padding:14px 30px;
                  border-radius:999px;
                  text-decoration:none;
                  font-weight:bold;
                "
              >
                Visit Website
              </a>

            </div>

            <hr
              style="
                margin:35px 0;
                border:none;
                border-top:1px solid #EDE7D8;
              "
            >

            <p
              style="
                font-size:13px;
                color:#777;
                text-align:center;
              "
            >
              You received this email because you subscribed
              to our newsletter.

              <br><br>

              <a
                href="${unsubscribeUrl}"
                style="
                  color:#C62828;
                  font-weight:bold;
                  text-decoration:none;
                "
              >
                Unsubscribe
              </a>

            </p>

          </td>
        </tr>

        <tr>
          <td
            style="
              background:#072A4A;
              padding:25px;
              text-align:center;
            "
          >

            <p style="color:white;font-weight:bold;">
              GBS | CIDP Kenya Chapter
            </p>

            <p style="color:#EDE7D8;">
              Support • Hope • Recovery
            </p>

            <a
              href="${WEBSITE_URL}"
              style="color:#2E9E68;"
            >
              ${WEBSITE_URL}
            </a>

            <p
              style="
                color:#EDE7D8;
                font-size:12px;
              "
            >
              © ${year} GBS | CIDP Kenya Chapter
            </p>

          </td>
        </tr>

      </table>

    </div>
  `,
});

return res.status(201).json({
  success: true,
  message: "Thank you for subscribing!",
  data: subscriber,
});


} catch (error) {
console.error("Newsletter Error:", error);


return res.status(500).json({
  success: false,
  message: "Unable to subscribe.",
});


}
};

exports.confirmUnsubscribe = async (req, res) => {
try {
const subscriber = await Newsletter.findOne({
unsubscribeToken: req.params.token,
});


if (!subscriber) {
  return res.status(404).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invalid Unsubscribe Link</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>

      <body
        style="
          background:#FAF7EF;
          font-family:Arial,sans-serif;
          padding:50px 20px;
          text-align:center;
        "
      >

        <div
          style="
            background:#fff;
            padding:40px;
            border-radius:15px;
            max-width:500px;
            margin:auto;
          "
        >

          <h1 style="color:#C62828;">
            Invalid Unsubscribe Link
          </h1>

          <p>
            This unsubscribe link is invalid or has expired.
          </p>

          <a
            href="${WEBSITE_URL}"
            style="
              display:inline-block;
              margin-top:20px;
              background:#072A4A;
              color:white;
              padding:14px 30px;
              border-radius:999px;
              text-decoration:none;
            "
          >
            Return to Website
          </a>

        </div>

      </body>
    </html>
  `);
}

res.send(`
  <!DOCTYPE html>
  <html>

    <head>
      <title>Confirm Unsubscribe</title>

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      >
    </head>

    <body
      style="
        background:#FAF7EF;
        font-family:Arial,sans-serif;
        padding:50px 20px;
        text-align:center;
      "
    >

      <div
        style="
          background:#fff;
          padding:40px;
          border-radius:15px;
          max-width:500px;
          margin:auto;
        "
      >

        <h1 style="color:#072A4A;">
          GBS | CIDP Kenya Chapter
        </h1>

        <h2>
          Confirm Unsubscribe
        </h2>

        <p>
          Remove
          <strong>${subscriber.email}</strong>
          from our newsletter?
        </p>

        <form method="POST">

          <button
            type="submit"
            style="
              background:#C62828;
              color:white;
              border:none;
              padding:15px 30px;
              border-radius:999px;
              cursor:pointer;
              font-size:16px;
            "
          >
            Yes, Unsubscribe
          </button>

        </form>

        <a
          href="${WEBSITE_URL}"
          style="
            display:block;
            margin-top:20px;
            color:#2E9E68;
            text-decoration:none;
          "
        >
          Keep Subscription
        </a>

      </div>

    </body>
  </html>
`);


} catch (error) {
console.error("Confirm Unsubscribe Error:", error);


res.status(500).send("Server Error");


}
};


exports.unsubscribe = async (req, res) => {
try {
const subscriber = await Newsletter.findOne({
unsubscribeToken: req.params.token,
});


if (!subscriber) {
  return res.status(404).send(`
    <h1>Invalid unsubscribe link.</h1>
  `);
}

subscriber.active = false;

await subscriber.save();

res.send(`
  <!DOCTYPE html>
  <html>

    <head>
      <title>Successfully Unsubscribed</title>

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      >
    </head>

    <body
      style="
        background:#FAF7EF;
        font-family:Arial,sans-serif;
        text-align:center;
        padding:60px 20px;
      "
    >

      <div
        style="
          background:white;
          padding:40px;
          border-radius:15px;
          max-width:500px;
          margin:auto;
        "
      >

        <h1 style="color:#2E9E68;">
          Successfully Unsubscribed
        </h1>

        <p>
          Your email has been removed from our newsletter.
        </p>

        <a
          href="${WEBSITE_URL}"
          style="
            display:inline-block;
            margin-top:20px;
            background:#072A4A;
            color:white;
            padding:14px 30px;
            border-radius:999px;
            text-decoration:none;
          "
        >
          Return to Website
        </a>

      </div>

    </body>
  </html>
`);


} catch (error) {
console.error("Unsubscribe Error:", error);


res.status(500).send("Server Error");


}
};




