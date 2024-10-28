import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import Toast from 'react-native-toast-message';
import { Adapt, Select, SelectProps, Sheet, Button, Spinner } from 'tamagui';

import { setCategories, setLoadingCategory } from '../redux/categorySlice';
import { findAllCategory } from '../services/ServicesAPI';
import { MessageToast } from '../types/message';
import { PageRequest } from '../types/page';
import { useAppDispatch, useAppSelector } from '../types/reduxHooks';

type CategorySelectProps = SelectProps & {
  defaultValue: string;
  selected: (selected: string) => void;
};

export function CategorySelect({ defaultValue, selected, ...props }: CategorySelectProps) {
  const dispatch = useAppDispatch();
  const loadingCategories = useAppSelector((state) => state.categories.loading);
  const categories = useAppSelector((state) => state.categories.categories);
  const pageCategories = useAppSelector((state) => state.categories.pageResponse);
  const [message, setMessage] = useState<MessageToast | null>();

  const [val, setVal] = useState(defaultValue);
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
    if (defaultValue === '') setVal(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
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
          title: 'Erro ao Buscar Categorias',
          text: 'Tente novamente. Se persistir entre em contato conosco',
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
    <Select
      value={val}
      onValueChange={(value) => {
        setVal(value);
        selected(value);
      }}
      disablePreventBodyScroll
      {...props}>
      <Select.Trigger
        margin={10}
        width={362}
        flex={1}
        iconAfter={<FontAwesome name="chevron-down" size={16} color="black" />}>
        <Select.Value placeholder="Categoria" />
      </Select.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet
          native={!!props.native}
          dismissOnSnapToBottom
          animationConfig={{
            type: 'spring',
            damping: 20,
            mass: 1.2,
            stiffness: 250,
          }}>
          <Sheet.Frame backgroundColor="#fff">
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
            <Toast position="top" topOffset={40} />
          </Sheet.Frame>
          <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.Viewport minWidth={200}>
          <Select.Group>
            <Select.Label>Categorias</Select.Label>
            {useMemo(
              () =>
                categories?.map((item, i) => {
                  return (
                    <Select.Item index={i} key={item.name + item.id} value={item.id}>
                      <Select.ItemText>{item.name}</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <FontAwesome5 name="check" size={16} color="black" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  );
                }),
              [categories]
            )}
          </Select.Group>
          <Button
            backgroundColor="#fff"
            color={categoryPageble.page! + 1 == pageCategories?.totalPages ? '#88888849' : '#000'}
            iconAfter={
              loadingCategories ? (
                <Spinner />
              ) : (
                <FontAwesome
                  name="plus"
                  size={14}
                  color={
                    categoryPageble.page! + 1 == pageCategories?.totalPages ? '#88888849' : 'green'
                  }
                />
              )
            }
            onPress={fetchMoreData}
            disabled={categoryPageble.page! + 1 == pageCategories?.totalPages}>
            Carregar mais dados
          </Button>
        </Select.Viewport>
      </Select.Content>
    </Select>
  );
}
