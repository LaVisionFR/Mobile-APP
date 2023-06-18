import TabBar from '@components/layout/tab-bar';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import Home from '@screens/home';
import Features from '@screens/features';
import { StatusBar } from 'expo-status-bar';
import Magazine from '@screens/magazine';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { fonts } from '@utils/fonts';
import { useFonts } from 'expo-font';

import Auteur from '@screens/magazine/auteur';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { Context, Recording, setStorageRecording, getRecordings, getStorageModel, setStorageModel, getStoragePitch, getStorageTypeIA, setStoragePitch, setStorageTypeIA } from '@utils/context';

import Article from '@screens/magazine/article';

import { useEffect, useMemo, useState } from 'react';

import { createStackNavigator, StackCardInterpolationProps, StackNavigationOptions, TransitionSpecs, HeaderStyleInterpolators } from '@react-navigation/stack';

import Ia from "@screens/features/ia"
import Shuffle from "@screens/features/shuffle"

// nav conf

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator()

export default function App() {

  // load the fonts

  const [fontsLoaded] = useFonts(fonts)

  	// search context

	const [recording, setterURI] = useState<Recording[]>([]);
	const [selectedModel, setterSelectedModel] = useState<string>("");
	const [type_ia, setterType_ia] = useState<string>("");
	const [pitch, setterPitch] = useState<number>(0);

  // don't display anything until the fonts are loaded

  // trigger navigation to the transform screen

  const navigationRef = useNavigationContainerRef()

  const horizontalAnimation: StackNavigationOptions = {
    gestureDirection: 'horizontal',
    transitionSpec: {
      open: TransitionSpecs.TransitionIOSSpec,
      close: TransitionSpecs.TransitionIOSSpec,
    },
    headerStyleInterpolator: HeaderStyleInterpolators.forFade,
    cardStyleInterpolator: ({
      current,
      layouts,
    }: StackCardInterpolationProps) => {
      return {
        cardStyle: {
          transform: [
            {
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.width, 0],
              }),
            },
          ],
        },
      };
    },
  };


	// custom setter for both
	// that also persists the data to local storage


  const setRecordingBase64 = (recording: Recording[]) => {
		setStorageRecording(recording).then(setterURI);
	}

	const setSelectedModel = (model: string) => {
		setStorageModel(model).then(setterSelectedModel);
	}

	const setType_ia = (type_ia: string) => {
		setStorageTypeIA(type_ia).then(setterType_ia);
	}

	const setPitch = (pitch: number) => {
		setStoragePitch(pitch).then(setterPitch);
	}

	useEffect(() => {
		getRecordings().then(setterURI)
		getStorageModel().then(setterSelectedModel)
		getStorageTypeIA().then(setterType_ia)
		getStoragePitch().then(setterPitch)
	}, [])

  // memoize the context,
	// to avoid needless React re-renders
	const value = useMemo(
		() => ({ recording, setRecordingBase64, selectedModel, setSelectedModel, type_ia, setType_ia, pitch, setPitch, }), [recording, selectedModel, type_ia, pitch]
	)

  const FeaturesStack = () => (
    <Context.Provider value={value}>
      <Stack.Navigator initialRouteName="Features">  
        <Stack.Screen
              name="Features"
              component={Features}
              options={{
                ...horizontalAnimation,
                headerShown: false,
                cardStyle: { backgroundColor: '#CA4735' },
              }}
          />
          <Stack.Screen
              name="Ia"
              component={Ia}
              options={{
                ...horizontalAnimation,
                headerShown: false,
                cardStyle: { backgroundColor: '#CA4735' },
              }}
          />
          <Stack.Screen
              name="Shuffle"
              component={Shuffle}
              options={{
                ...horizontalAnimation,
                headerShown: false,
                cardStyle: { backgroundColor: '#CA4735' },
              }}
          />
      </Stack.Navigator>
    </Context.Provider>
  );

  const MagazineStack = () => (
    <Stack.Navigator initialRouteName="Magazine">  
      <Stack.Screen
            name="Magazine"
            component={Magazine}
            options={{
              ...horizontalAnimation,
              headerShown: false,
              cardStyle: { backgroundColor: '#CA4735' },
            }}
        />
        <Stack.Screen
            name="Article"
            component={Article}
            options={{
              ...horizontalAnimation,
              headerShown: false,
              cardStyle: { backgroundColor: '#CA4735' },
            }}
        />
        <Stack.Screen
            name="Auteur"
            component={Auteur}
            options={{
              ...horizontalAnimation,
              headerShown: false,
              cardStyle: { backgroundColor: '#CA4735' },
            }}
        />
    </Stack.Navigator>
  );

  
  const TabNavigator = () => {
    return (
      <Tab.Navigator
        tabBarPosition='bottom'
        initialRouteName='Home'
        tabBar={TabBar}
        sceneContainerStyle={{ backgroundColor: "transparent" }}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Magazine" component={MagazineStack} />
		    <Tab.Screen name="Features" component={FeaturesStack} />
      </Tab.Navigator>
    )
  }
  // render

  return (
    <BottomSheetModalProvider>
      {
        fontsLoaded ?
          <SafeAreaProvider style={{ backgroundColor: "#CA4735" }}>
            <NavigationContainer ref={navigationRef}>
              <TabNavigator />
            </NavigationContainer>
            <StatusBar style="auto" />
          </SafeAreaProvider>
          :
          <></>
      }
    </BottomSheetModalProvider>
  )
}
