import { H1, H4, Image } from 'tamagui';

import { Container } from './Container';

export const InitialScreen = () => {
  return (
    <Container alignItems="center" justifyContent="center">
      <H1
        fontWeight="700"
        fontStyle="italic"
        $theme-dark={{ col: '$gray11Dark' }}
        $theme-light={{ col: '$gray11Light' }}>
        Service System
      </H1>
      <Image
        source={{
          uri: require('../../assets/logo.png'),
          width: 360,
          height: 360,
        }}
      />
      <H4
        fontWeight="600"
        $theme-dark={{ col: '$gray11Dark' }}
        $theme-light={{ col: '$gray11Light' }}>
        Version 1.0
      </H4>
    </Container>
  );
};
