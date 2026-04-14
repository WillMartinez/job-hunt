export const cognitoConfig = {
  region: process.env.NEXT_PUBLIC_AWS_REGION ?? "us-east-1",
  userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID ?? "",
  userPoolWebClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID ?? "",
};
