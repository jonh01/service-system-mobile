import { Redirect } from 'expo-router';

export default function App() {
  const isLogged = true;

  if (!isLogged) return <Redirect href="/(stack-auth)" />;

  return <Redirect href="/(tabs-app)" />;

}