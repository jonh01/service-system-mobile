import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { Button, Form, H1, Image, Spinner } from 'tamagui';

import { Label } from '../components/Label';
import { signIn } from '../redux/authSlice';
import { SignUpAPI } from '../services/ServicesAPI';
import { MessageToast } from '../types/message';
import { useAppDispatch } from '../types/reduxHooks';
import { formatCPF, formatPhone } from '../utils/formatters';

import { Container } from '~/app/components/Container';

export default function SignUp() {
  const dispatch = useAppDispatch();
  const { name, email, picture, googlePhone, googleToken } = useLocalSearchParams<{
    googleToken: string;
    name: string;
    email: string;
    picture: string;
    googlePhone: string;
  }>();
  const [status, setStatus] = useState<'off' | 'submitting' | 'submitted'>('off');

  const [message, setMessage] = useState<MessageToast | null>();

  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState(googlePhone ?? '');

  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  const phoneRegex = /^\(\d{2}\)\d{4,5}-\d{4}$/;

  useEffect(() => {
    if (status === 'submitting') {
      SignUpAPI(
        {
          name,
          email,
          cpf,
          phone,
          image: picture,
        },
        googleToken
      )
        .then((response) => {
          dispatch(signIn({ user: response.data, googleToken }));
          console.log('criei a conta: ' + googleToken + ' \n resposta: ' + response.data);
        })
        .catch((response) => {
          console.log('deu ruim ao criar a conta: ' + response.message);
          setMessage({
            type: 'error',
            title: 'Erro ao criar uma conta',
            text: 'Tente novamente. Se persistir entre em contato conosco.',
          });
        })
        .finally(() => {
          setStatus('off');
        });
    }
  }, [status]);

  useEffect(() => {
    if (message) {
      Toast.show({
        autoHide: true,
        visibilityTime: 5000,
        type: message.type,
        text1: message?.title,
        text2: message?.text,
      });
    }
  }, [message]);

  return (
    <Container>
      <H1
        textAlign="center"
        alignSelf="center"
        fontWeight="700"
        mt="$8"
        mb="$6"
        $theme-dark={{ col: '$gray11Dark' }}
        $theme-light={{ col: '$gray11Light' }}>
        Complete seu Cadastro
      </H1>
      <Image
        alignSelf="center"
        source={{
          uri: require('../../assets/icon.png'),
          width: 128,
          height: 128,
        }}
      />
      <Form
        mt="$6"
        space="$7"
        onSubmit={() => {
          cpfRegex.test(cpf) && phoneRegex.test(phone) ? setStatus('submitting') : setStatus('off');
        }}>
        <Label
          name="Nome:"
          htmlFor="usuName"
          id="usuName"
          placeholder="Seu nome"
          disabled
          value={name}
        />
        <Label
          name="E-mail:"
          htmlFor="email"
          id="email"
          placeholder="Seu E-mail"
          disabled
          value={email}
        />
        <Label
          name="CPF:"
          htmlFor="cpf"
          id="cpf"
          placeholder="Seu CPF"
          keyboardType="number-pad"
          borderColor={cpf != '' && !cpfRegex.test(cpf) ? '#ff0000' : '$borderColor'}
          focusStyle={{
            borderColor: cpf != '' && !cpfRegex.test(cpf) ? '#ff0000' : '$borderColor',
          }}
          defaultValue={cpf}
          onChangeText={(text) => {
            setCpf(formatCPF(text));
          }}
        />
        <Label
          name="Telefone:"
          htmlFor="phone"
          id="phone"
          placeholder="Seu Telefone"
          inputMode="tel"
          keyboardType="number-pad"
          borderColor={phone != '' && !phoneRegex.test(phone) ? '#ff0000' : '$borderColor'}
          focusStyle={{
            borderColor: phone != '' && !phoneRegex.test(phone) ? '#ff0000' : '$borderColor',
          }}
          defaultValue={phone}
          onChangeText={(text) => {
            setPhone(formatPhone(text));
          }}
        />
        <Form.Trigger asChild>
          <Button
            mt="$3"
            alignSelf="center"
            width="$20"
            icon={status === 'submitting' ? () => <Spinner /> : undefined}>
            Enviar
          </Button>
        </Form.Trigger>
      </Form>
    </Container>
  );
}
