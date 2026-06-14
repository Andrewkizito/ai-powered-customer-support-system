import { CognitoJwtVerifier } from "aws-jwt-verify";
import aws_config from "../../../amplify_outputs.json";

const verifier = CognitoJwtVerifier.create({
  userPoolId: aws_config.auth.user_pool_id,
  tokenUse: "access",
  clientId: aws_config.auth.user_pool_client_id,
});

export const validateSession = async (req: Bun.BunRequest) => {
  const authHeader = req.headers.get("Authorization");
  const errorResponse = Response.json(
    {
      message: "Not Authorized",
    },
    {
      status: 403,
    },
  );

  if (!authHeader) return errorResponse;

  try {
    const res = await verifier.verify(authHeader);
    console.log({ res });
    return true;
  } catch (error) {
    return errorResponse;
  }
};
