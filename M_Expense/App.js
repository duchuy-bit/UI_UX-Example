import React from 'react';
import { Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {enableScreens} from 'react-native-screens';
import HomeScreen from './android/src/screens/HomeScreen';
import AddScreen from './android/src/screens/AddScreen';


enableScreens();

const Stack = createSharedElementStackNavigator();

function App (){
    return(
    <NavigationContainer>
        <Stack.Navigator  screenOptions={{headerShown: false}} >
            <Stack.Screen name="HomeScreen" component={HomeScreen}  />
            <Stack.Screen name="AddScreen" component={AddScreen}  />
            {/* <Stack.Screen name="HomeScreen" component={HomeScreen}  />
            <Stack.Screen name="ViewImageScreen" component={ViewImageScreen}   />
            <Stack.Screen name="AddImageScreen" component={AddImageScreen}   /> */}
        </Stack.Navigator>
    </NavigationContainer>
    )
}
export default App;

