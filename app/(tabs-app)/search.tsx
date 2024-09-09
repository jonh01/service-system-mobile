import { Text } from 'tamagui';

import SearchButton from '../components/SearchButton';
import { TabsContainer } from '../components/TabsContainer';

export default function Search() {
  const handleSearchPress = () => {
    console.log('Search button pressed');
  };

  return (
    <TabsContainer overflow="hidden">
      <SearchButton placeholder="Busque por um serviço..." onPress={handleSearchPress} />
      <Text>search</Text>
      <Text>search</Text>
      <Text>search</Text>
      <Text>search</Text>
    </TabsContainer>
  );
}
