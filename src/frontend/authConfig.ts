import outputs from "../../amplify_outputs.json";

const { user_pool_id, user_pool_client_id, aws_region } = outputs.auth;
const origin = typeof window !== "undefined" ? window.location.origin : "";

export const cognitoAuthConfig = {
  authority: `https://cognito-idp.${aws_region}.amazonaws.com/${user_pool_id}`,
  client_id: user_pool_client_id,
  redirect_uri: origin,
  response_type: "code",
  scope: "aws.cognito.signin.user.admin email openid phone profile",
};
