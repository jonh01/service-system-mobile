import { Tabs, Redirect } from 'expo-router';

export default function Layout() {
  const isLogged = true;

  if (!isLogged) return <Redirect href="/signin" />;

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="(stack)"
        options={{
          title: 'stack',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
