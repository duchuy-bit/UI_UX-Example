import React from 'react';
import { Text, View } from 'react-native';


import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {enableScreens} from 'react-native-screens';


enableScreens();

import HomeScreen from './Home';
import ViewImageScreen from './ViewImage';
import AddImageScreen from './AddImage';
// const Stack = createNativeStackNavigator();
const Stack = createSharedElementStackNavigator();

function MainNavigation (){
    return(
    <NavigationContainer>
        <Stack.Navigator  screenOptions={{headerShown: false}} >
            <Stack.Screen name="HomeScreen" component={HomeScreen}  />
            <Stack.Screen name="ViewImageScreen" component={ViewImageScreen}   />
            <Stack.Screen name="AddImageScreen" component={AddImageScreen}   />
        </Stack.Navigator>
    </NavigationContainer>
    )
}
export default MainNavigation;
