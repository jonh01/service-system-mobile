import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert } from 'react-native';
import { Button, Image, XStack } from 'tamagui';

type ImageUploadProps = {
  setImage: (image: string) => void;
};

export const ImageUpload = ({ setImage }: ImageUploadProps) => {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      if (result.assets[0].base64 != null) setImage(result.assets[0].base64);
    } else {
      Alert.alert('Aviso', 'Nenhuma imagem selecionada!');
    }
  };

  return (
    <XStack
      borderColor="#cacaca"
      justifyContent="space-evenly"
      alignItems="center"
      height={160}
      padding={10}
      margin={20}>
      <Button
        height={140}
        width={140}
        borderWidth={1}
        backgroundColor="#fff"
        borderColor="#cacaca"
        borderRadius={10}
        borderTopWidth={0}
        justifyContent="space-evenly"
        onPress={pickImageAsync}
        icon={<FontAwesome6 name="upload" size={24} color="black" />}
      />
      <FontAwesome5 name="arrow-circle-right" size={20} color="black" />
      <Image
        height={140}
        width={140}
        source={{
          uri: selectedImage ?? require('../../assets/image.png'),
        }}
      />
    </XStack>
  );
};
