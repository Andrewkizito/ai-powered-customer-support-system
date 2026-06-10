import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "customerSupportBucket",
  access: (allow) => ({
    "public/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write"]),
    ],
    "private/*": [
      allow.authenticated.to(["read", "write"]),
    ],
    "protected/{entity_id}/*": [
      allow.entity("identity").to(["read", "write", "delete"]),
    ],
  }),
});
