import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import mobileAds from 'react-native-google-mobile-ads';

import { InitialScreen } from './components/InitialScreen';
import { useAppSelector } from './types/reduxHooks';

export default function App() {
  const signed = useAppSelector((state) => state.auth.signed);
  const [loadingGoogle, setLoadingGoogle] = useState<boolean>(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    mobileAds()
      .initialize()
      .then((adapterStatuses) => {
        console.log('anuncios on!');
      });
    auth().onAuthStateChanged((userState) => {
      setUser(userState);

      if (loadingGoogle) {
        setLoadingGoogle(false);
      }
    });
  }, []);

  if (loadingGoogle) {
    return <InitialScreen />;
  }

  return user != null && signed ? (
    <Redirect href="/(tabs-app)" />
  ) : (
    <Redirect href="/(stack-auth)" />
  );
}
