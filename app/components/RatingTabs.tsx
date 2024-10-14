import { Separator, SizableText, Tabs, TabsContentProps } from 'tamagui';

type RatingTabsProps = {
  ratings: React.JSX.Element;
  reviewsNote: React.JSX.Element;
};
export const RatingTabs = ({ ratings, reviewsNote }: RatingTabsProps) => {
  return (
    <Tabs
      alignSelf="center"
      defaultValue="tab1"
      orientation="horizontal"
      flexDirection="column"
      width={390}
      height={518}
      borderRadius="$4"
      borderWidth="$0.25"
      overflow="hidden"
      borderColor="$borderColor">
      <Tabs.List separator={<Separator vertical />} disablePassBorderRadius="bottom">
        <Tabs.Tab flex={1} value="tab1">
          <SizableText fontFamily="$body">Comentários</SizableText>
        </Tabs.Tab>
        <Tabs.Tab flex={1} value="tab2">
          <SizableText fontFamily="$body">Avaliações</SizableText>
        </Tabs.Tab>
      </Tabs.List>
      <Separator />
      <TabsContent value="tab1">{ratings}</TabsContent>
      <TabsContent value="tab2">{reviewsNote}</TabsContent>
    </Tabs>
  );
};

const TabsContent = (props: TabsContentProps) => {
  return (
    <Tabs.Content
      key={props.value}
      alignItems="center"
      paddingTop={20}
      flex={1}
      backgroundColor="#fff"
      {...props}>
      {props.children}
    </Tabs.Content>
  );
};
