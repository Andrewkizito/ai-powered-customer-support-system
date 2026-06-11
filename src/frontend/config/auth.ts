import aws_config from "../../../amplify_outputs.json";

export const origin = window.location.origin;

export const cognitoAuthConfig = {
  authority: `https://cognito-idp.${aws_config.auth.aws_region}.amazonaws.com/${aws_config.auth.user_pool_id}`,
  client_id: aws_config.auth.user_pool_client_id,
  redirect_uri: origin,
  response_type: "code",
  scope: "aws.cognito.signin.user.admin email openid phone profile",
};
