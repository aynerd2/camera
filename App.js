import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Direction from './components/Direction';

const Stack = createNativeStackNavigator();

function MainStack() {

      return(
            <Stack.Navigator>
  
            <Stack.Screen
                  name='Direction'
                  component={Direction}
                  options={{
                    headerTitle: '',
                    headerShown: false,
          
                  }} />
          
              </Stack.Navigator>

      )
}


const App = () =>{

      

  return (

      <NavigationContainer>
            <MainStack/>
      </NavigationContainer>
  )
}

export default App
