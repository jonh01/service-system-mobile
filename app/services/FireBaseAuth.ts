import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_URL_GOOGLE_API_KEY,
});

export const SignIn = async () => {
  // Check if your device supports Google Play
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  // Get the users ID token
  const { data } = await GoogleSignin.signIn();

  const idToken = data!.idToken;

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  const userAuth = await auth().signInWithCredential(googleCredential);
  return { userAuth, idToken };
};

export const SignOut = async () => {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    auth()
      .signOut()
      .then(() => {
        console.log('Você está se desconectando...');
      });
  } catch (error) {
    console.error(error);
  }
};
