import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, H1, Progress } from 'tamagui';

import { Container } from '../components/Container';
import { SignIn as signInFirebase } from '../services/FireBaseAuth';
import { SignInAPI } from '../services/ServicesAPI';
import { useAppDispatch } from '../types/reduxHooks';
import { CustomDialog } from '../components/Spinner';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    signInFirebase()
      .then((response) => {
        SignInAPI(response.idToken!)
          .then((responseSuccess) => {
            setLoading(false);
            // dispatch(signInRedux({ user: response.data }));
            console.log(response.idToken! + '\n\n' + responseSuccess.data);
          })
          .catch((responseError) => {
            setLoading(false);
            const phone = response.userAuth.user.phoneNumber?.length
              ? response.userAuth.user.phoneNumber
              : '';
            responseError.message.includes('404')
              ? router.push(
                  `/(stack-auth)/signup?googleToken=${response.idToken!}&name=${response.userAuth.user.displayName}&email=${response.userAuth.user.email}&picture=${response.userAuth.user.photoURL}&googlePhone=${phone}`
                )
              : console.log('Erro ao fazer login: ' + responseError.message);
          });
      })
      .catch((error) => {
        console.log('error: ', error);
        setLoading(false);
      });
  };

  return (
    <Container ai="center" jc="flex-end">
      <H1
        fontWeight="700"
        fontStyle="italic"
        $theme-dark={{ col: '$gray11Dark' }}
        $theme-light={{ col: '$gray11Light' }}>
        Bem Vindo!
      </H1>
      <Image
        source={{
          uri: require('../../assets/logo.png'),
          width: 300,
          height: 300,
        }}
      />
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        style={{marginTop:160, marginBottom: 60}}
        onPress={() => handleSignIn()}
      />
      <Progress value={undefined}>
          <Progress.Indicator animation="bouncy" />
      </Progress>
    </Container>
  );
}
