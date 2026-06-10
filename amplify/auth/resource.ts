import { defineAuth } from "@aws-amplify/backend";

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
