import { Separator, SizableText, Tabs, TabsContentProps, TabsProps } from 'tamagui';

type CustomTabsProps = TabsProps & {
  tab1: React.JSX.Element;
  tab1Name: string;
  tab2: React.JSX.Element;
  tab2Name: string;
};
export const CustomTabs = ({ tab1, tab1Name, tab2, tab2Name, ...props }: CustomTabsProps) => {
  return (
    <Tabs
      alignSelf="center"
      defaultValue="tab1"
      orientation="horizontal"
      flexDirection="column"
      borderRadius="$4"
      borderWidth="$0.25"
      overflow="hidden"
      borderColor="$borderColor"
      {...props}>
      <Tabs.List separator={<Separator vertical />} disablePassBorderRadius="bottom">
        <Tabs.Tab flex={1} value="tab1">
          <SizableText fontFamily="$body">{tab1Name}</SizableText>
        </Tabs.Tab>
        <Tabs.Tab flex={1} value="tab2">
          <SizableText fontFamily="$body">{tab2Name}</SizableText>
        </Tabs.Tab>
      </Tabs.List>
      <Separator />
      <TabsContent value="tab1">{tab1}</TabsContent>
      <TabsContent value="tab2">{tab2}</TabsContent>
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
