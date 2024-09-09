import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, Form, H1, Image, Spinner } from 'tamagui';

import { Label } from '../components/label';
import { formatCPF, formatPhone } from '../utils/formatters';

import { Container } from '~/app/components/Container';

export default function SignUp() {
  const { name, email } = useLocalSearchParams<{ name: string; email: string }>();
  const [status, setStatus] = useState<'off' | 'submitting' | 'submitted'>('off');

  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (status === 'submitting') {
      console.log(name + '' + email);
      const timer = setTimeout(() => setStatus('off'), 2000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [status]);

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
      <Form mt="$6" space="$7" onSubmit={() => setStatus('submitting')}>
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
          value={cpf}
          onChangeText={(text) => setCpf(formatCPF(text))}
        />
        <Label
          name="Telefone:"
          htmlFor="phone"
          id="phone"
          placeholder="Seu Telefone"
          inputMode="tel"
          keyboardType="number-pad"
          value={phone}
          onChangeText={(text) => setPhone(formatPhone(text))}
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
