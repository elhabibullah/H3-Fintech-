// This service is designed to be connected to Firebase Authentication later.
// Current state: Inactive / Preparation Phase

export interface AuthResponse {
  success: boolean;
  verificationId?: string;
  user?: any;
  error?: string;
}

export const setupRecaptcha = (elementId: string) => {
  // Placeholder for window.RecaptchaVerifier
  console.log(`[Auth] Recaptcha setup for ${elementId}`);
};

// --- SMS Auth (Existing Users Only) ---

export const checkUserExists = async (phoneNumber: string): Promise<boolean> => {
  // Mock check against database
  // In real Firebase, this might check a users collection
  await new Promise(resolve => setTimeout(resolve, 500));
  const normalized = phoneNumber.replace(/\D/g, '');
  // Simulate that only numbers ending in '00' exist for testing, or assume all valid formats exist for this demo EXCEPT specific test case
  return true; 
};

export const signInWithPhoneNumber = async (phoneNumber: string): Promise<AuthResponse> => {
  console.log(`[Auth] Initiating sign in for ${phoneNumber}`);
  
  // Simulation of API call latency
  await new Promise(resolve => setTimeout(resolve, 1000));

  // TODO: Connect Firebase signInWithPhoneNumber
  return {
    success: true,
    verificationId: "mock_sms_id_" + Date.now()
  };
};

export const verifySmsCode = async (verificationId: string, code: string): Promise<AuthResponse> => {
  console.log(`[Auth] Verifying SMS code ${code}`);
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (code === "123456") { // Mock valid code
      return {
        success: true,
        user: { uid: "firebase_user_" + Date.now() }
      };
  }
  return { success: false, error: "Invalid verification code" };
};

// --- Email Auth (New Users) ---

export const sendEmailVerification = async (email: string): Promise<AuthResponse> => {
  console.log(`[Auth] Sending verification email to ${email}`);
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // TODO: Connect Firebase sendSignInLinkToEmail or createUserWithEmailAndPassword + sendEmailVerification
  return { success: true };
};

export const checkEmailVerified = async (email: string): Promise<boolean> => {
  // Mock check
  return true;
};
