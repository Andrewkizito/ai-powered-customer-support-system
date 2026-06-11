import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  name: "CustomerSupport",
  loginWith: {
    email: {
      otpLogin: false,

      verificationEmailStyle: "CODE",
      verificationEmailSubject: "Verify your Customer Support account",
      verificationEmailBody: (createCode) => `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2>Welcome to CustomerSupport</h2>

          <p>Thanks for creating an account. Use the verification code below to confirm your email address:</p>

          <div style="
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 6px;
            margin: 24px 0;
            padding: 16px;
            background: #f3f4f6;
            border-radius: 8px;
            text-align: center;
          ">
            ${createCode()}
          </div>

          <p>This code is only valid for a limited time.</p>

          <p style="font-size: 13px; color: #6b7280;">
            If you did not create this account, you can safely ignore this email.
          </p>
        </div>
      `,

      userInvitation: {
        emailSubject: "You have been invited to CustomerSupport",
        emailBody: (user, code) => `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
            <h2>Welcome to CustomerSupport</h2>

            <p>An account has been created for you.</p>

            <p>You can sign in using the details below:</p>

            <p>
              <strong>Username:</strong> ${user()}<br />
              <strong>Temporary password:</strong> ${code()}
            </p>

            <p>
              After signing in, you may be asked to set a new password.
            </p>

            <p style="font-size: 13px; color: #6b7280;">
              If you were not expecting this invitation, please ignore this email.
            </p>
          </div>
        `,
      },
    },
  },
});
