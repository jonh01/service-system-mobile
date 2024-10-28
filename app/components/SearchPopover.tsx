import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { Adapt, Button, H4, Popover, PopoverProps, RadioGroup, Spinner, YStack } from 'tamagui';

import { Label } from './Label';
import { RadioGroupItemWithLabel } from './RadioGroupItemWithLabel';
import { setCategories, setLoadingCategory } from '../redux/categorySlice';
import { findAllCategory } from '../services/ServicesAPI';
import { MessageToast } from '../types/message';
import { PageRequest } from '../types/page';
import { useAppDispatch, useAppSelector } from '../types/reduxHooks';

type SearchPopoverProps = PopoverProps & {
  shouldAdapt?: boolean;
  exit: (category: string, local: string) => void;
};

export default function SearchPopover({ shouldAdapt, exit, ...props }: SearchPopoverProps) {
  const dispatch = useAppDispatch();

  const loadingCategories = useAppSelector((state) => state.categories.loading);
  const categories = useAppSelector((state) => state.categories.categories);
  const pageCategories = useAppSelector((state) => state.categories.pageResponse);
  const [message, setMessage] = useState<MessageToast | null>();

  const [value, setValue] = useState('todas');
  const [local, setLocal] = useState('');
  const [categoryPageble, setCategoryPageble] = useState<PageRequest>({
    page: 0,
    size: 8,
    sort: [
      {
        orderBy: 'id',
        direction: 'desc',
      },
    ],
  });

  useEffect(() => {
    setMessage(null);
    dispatch(setLoadingCategory());
    findAllCategory(categoryPageble)
      .then((response) => {
        console.log('page:', response);
        dispatch(setCategories(response));
      })
      .catch((error) => {
        console.log('error:', error.message);
        setMessage({
          type: 'error',
          title: 'Nenhuma Categoria encontrada.',
          text: 'Tente novamente.',
        });
      });
  }, [categoryPageble]);

  const fetchMoreData = () => {
    if (!pageCategories?.last && pageCategories?.totalPages != categoryPageble.page! + 1) {
      setCategoryPageble((prev) => ({ ...prev, page: categoryPageble.page! + 1 }));
      console.log('deu bom');
    } else {
      console.log('acabou');
    }
  };

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
    <Popover size="$5" allowFlip {...props}>
      <Popover.Trigger asChild>
        <Button
          icon={
            <FontAwesome
              name="filter"
              color={value.includes('todas') && local!.length == 0 ? '#979797' : '#71ff78'}
              size={22}
            />
          }
          $theme-light={{ backgroundColor: '#fff' }}
          $theme-dark={{ backgroundColor: '#000' }}
        />
      </Popover.Trigger>

      {shouldAdapt && (
        <Adapt when="sm" platform="touch">
          <Popover.Sheet modal dismissOnSnapToBottom snapPoints={[64]}>
            <Popover.Sheet.Frame padding="$4">
              <Adapt.Contents />
              <Toast position="top" topOffset={40} />
            </Popover.Sheet.Frame>
            <Popover.Sheet.Overlay
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Popover.Sheet>
        </Adapt>
      )}

      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}>
        <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

        <YStack>
          <YStack alignItems="flex-end" mb={12}>
            <TouchableOpacity
              onPress={() => {
                setLocal('');
                setValue('todas');
              }}>
              <FontAwesome6 name="filter-circle-xmark" size={20} />
            </TouchableOpacity>
          </YStack>
          <Label
            name="Local:"
            htmlFor="local"
            id="local"
            placeholder="Informe um Local"
            keyboardType="default"
            onChangeText={(text) => {
              setLocal(text);
            }}
            defaultValue={local}
          />
          <RadioGroup
            aria-labelledby="Select one item"
            value={value}
            name="form"
            onValueChange={(value) => {
              setValue(value);
            }}>
            <H4 marginVertical={20}>Categorias:</H4>
            <YStack alignItems="center">
              <FlatList
                style={{ height: 310, marginBottom: 30 }}
                showsVerticalScrollIndicator={false}
                data={categories} // alterar
                keyExtractor={(category) => category.id!.toString()}
                ListHeaderComponent={
                  <RadioGroupItemWithLabel size="$4" value="todas" label="Todas" />
                }
                renderItem={({ item }) => (
                  <RadioGroupItemWithLabel size="$4" value={item.id} label={item.name} />
                )}
                onEndReachedThreshold={0.1}
                onEndReached={categories != null ? fetchMoreData : null}
                ListFooterComponent={
                  categories && !pageCategories?.last ? <Spinner size="small" mt={20} /> : null
                }
              />
            </YStack>
          </RadioGroup>
          <Popover.Close asChild>
            <YStack space>
              <Button
                size="$3"
                onPress={() => {
                  exit(value, local);
                }}>
                Confirmar
              </Button>
            </YStack>
          </Popover.Close>
        </YStack>
      </Popover.Content>
    </Popover>
  );
}
