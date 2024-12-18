export default {
  expo: {
    name: 'service-system',
    slug: 'service-system',
    version: '1.0.0',
    scheme: 'service-system',
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-router',
      '@react-native-firebase/app',
      '@react-native-firebase/auth',
      '@react-native-google-signin/google-signin',
      [
        'react-native-google-mobile-ads',
        {
          androidAppId: 'ca-app-pub-1574773110001809~8150689501',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      tsconfigPaths: true,
    },
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
      package: 'com.servicesystem',
    },
    extra: {
      eas: {
        projectId: '3945946f-89c3-4d7f-a4f3-0624343337d5',
      },
    },
  },
};
