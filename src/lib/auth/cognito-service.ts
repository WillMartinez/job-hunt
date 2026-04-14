import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
  ISignUpResult,
} from "amazon-cognito-identity-js";
import { cognitoConfig } from "./cognito-config";

// Function to create a fresh user pool
const createUserPool = () =>
  new CognitoUserPool({
    UserPoolId: cognitoConfig.userPoolId,
    ClientId: cognitoConfig.userPoolWebClientId,
  });

let userPool = createUserPool();

export const authService = {
  signUp: (email: string, password: string): Promise<ISignUpResult> => {
    return new Promise((resolve, reject) => {
      const attributeList = [
        new CognitoUserAttribute({ Name: "email", Value: email }),
      ];
      userPool.signUp(email, password, attributeList, [], (err, result) => {
        if (err) { reject(err); return; }
        if (result) { resolve(result); }
      });
    });
  },

  signIn: (email: string, password: string): Promise<CognitoUserSession> => {
    return new Promise((resolve, reject) => {
      const authDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });
      const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (result) => resolve(result),
        onFailure: (err) => reject(err),
      });
    });
  },

  confirmSignUp: (email: string, code: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
      cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) { reject(err); return; }
        resolve(result || "SUCCESS");
      });
    });
  },

  signOut: (): void => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) cognitoUser.signOut();
    userPool = createUserPool();
  },

  getCurrentUser: (): CognitoUser | null => userPool.getCurrentUser(),

  getSession: (): Promise<CognitoUserSession> => {
    const cognitoUser = userPool.getCurrentUser();
    return new Promise((resolve, reject) => {
      if (!cognitoUser) { reject(new Error("No user found")); return; }
      cognitoUser.getSession(
        (err: Error | null, session: CognitoUserSession | null) => {
          if (err) { reject(err); return; }
          if (session) resolve(session);
          else reject(new Error("No session found"));
        }
      );
    });
  },
};
