import { defineAuth } from "@aws-amplify/backend";

const verificationEmail = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 16px">
      <tr>
        <td align="center">
          <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
            <tr>
              <td style="padding:40px 40px 0 40px">
                <h1 style="margin:0;font-size:24px;font-weight:700;color:#18181b">Verify your email</h1>
                <p style="margin:12px 0 0 0;font-size:15px;color:#71717a;line-height:1.5">
                  Thanks for signing up! Use the code below to verify your email address.
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:32px 40px">
                <div style="background-color:#f4f4f5;border-radius:8px;padding:20px 32px;display:inline-block;letter-spacing:8px;font-size:32px;font-weight:700;color:#18181b;font-family:monospace">
                  {####}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 32px 40px">
                <p style="margin:0;font-size:13px;color:#a1a1aa;line-height:1.5">
                  This code expires in 1 hour. If you didn't request this, you can safely ignore this email.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 32px 40px;border-top:1px solid #f4f4f5">
                <p style="margin:16px 0 0 0;font-size:12px;color:#a1a1aa;text-align:center">
                  &copy; Customer Support. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

const invitationEmail = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 16px">
      <tr>
        <td align="center">
          <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
            <tr>
              <td style="padding:40px 40px 0 40px">
                <h1 style="margin:0;font-size:24px;font-weight:700;color:#18181b">You're invited!</h1>
                <p style="margin:12px 0 0 0;font-size:15px;color:#71717a;line-height:1.5">
                  An account has been created for you. Sign in with the credentials below.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 40px">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;border-radius:8px;padding:16px 20px">
                  <tr>
                    <td style="padding:4px 0">
                      <span style="font-size:13px;color:#71717a">Username</span>
                      <p style="margin:2px 0 0 0;font-size:15px;font-weight:600;color:#18181b;font-family:monospace">{username}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0 4px 0;border-top:1px solid #e4e4e7">
                      <span style="font-size:13px;color:#71717a">Temporary password</span>
                      <p style="margin:2px 0 0 0;font-size:15px;font-weight:600;color:#18181b;font-family:monospace">{####}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 32px 40px">
                <p style="margin:0;font-size:13px;color:#a1a1aa;line-height:1.5">
                  You'll be prompted to set a new password on first sign in. This link expires in 7 days.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 32px 40px;border-top:1px solid #f4f4f5">
                <p style="margin:16px 0 0 0;font-size:12px;color:#a1a1aa;text-align:center">
                  &copy; Customer Support. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

export const auth = defineAuth({
  name: "customerSupportAuth",
  loginWith: {
    email: true,
  },
  userAttributes: {
    preferredUsername: { required: false, mutable: true },
    profilePicture: { required: false, mutable: true },
  },
  multifactor: {
    mode: "OPTIONAL",
    totp: true,
  },
});
