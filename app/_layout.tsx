import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { TamaguiProvider, Theme } from 'tamagui';

import { persistor, store } from './redux/store';
import { useAppSelector } from './types/reduxHooks';
import config from '../tamagui.config';

const Main = () => {
  const isThemeDark = useAppSelector((state) => state.theme.isThemeDark);

  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <TamaguiProvider config={config}>
      <Theme name={isThemeDark ? 'dark' : 'light'}>
        <ThemeProvider value={isThemeDark ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(stack-auth)" options={{ title: 'Auth' }} />
            <Stack.Screen name="(tabs-app)" options={{ title: 'App' }} />
          </Stack>
        </ThemeProvider>
      </Theme>
    </TamaguiProvider>
  );
};

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Main />
      </PersistGate>
    </Provider>
  );
}
