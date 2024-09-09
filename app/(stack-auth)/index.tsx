import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, H1, Button } from 'tamagui';

import { Container } from '../components/Container';
import { findAllCategory, RefreshTokenAPI, SignInAPI, SignOutAPI } from '../services/ServicesAPI';

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState<string>('jhony');
  const [email, setEmail] = useState<string>('jhony@email.com');
  return (
    <Container ai="center" jc="center">
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
          width: 250,
          height: 250,
        }}
      />
      <Button
        onPress={() => {
          router.push(`/(stack-auth)/signup?name=${name}&email=${email}`);
        }}>
        Show Sign Up
      </Button>
      <Button
        onPress={() => {
          SignInAPI('123456')
            .then((response) => {
              console.log('Deu certo! \n\n');
              console.log(response.data);
              console.log('\n\n');
              console.log(response.headers);
            })
            .catch((response) => {
              console.log(response);
            });
        }}>
        Sign In
      </Button>
      <Button
        onPress={() => {
          SignOutAPI()
            .then((response) => {
              console.log('Deu certo! \n\n');
              console.log(response.data);
              console.log('\n\n');
              console.log(response.headers);
            })
            .catch((response) => {
              console.log(response);
            });
        }}>
        Logoff
      </Button>
      <Button
        onPress={() => {
          RefreshTokenAPI()
            .then((response) => {
              console.log('Deu certo! \n\n');
              console.log(response);
              console.log('\n\n');
              console.log(response.headers);
            })
            .catch((response) => {
              console.log(response);
            });
        }}>
        Refresh Token
      </Button>
      <Button
        onPress={() => {
          findAllCategory({
            page: 0,
            size: 5,
            sort: [{ orderBy: 'id', direction: 'asc' }],
          })
            .then((response) => {
              console.log('Deu certo! \n\n');
              console.log(response.data);
              console.log('\n\n');
              console.log(response.headers);
            })
            .catch((response) => {
              console.log(response);
            });
        }}>
        Recuperar Dado
      </Button>
    </Container>
  );
}
