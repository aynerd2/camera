import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera, faList } from '@fortawesome/free-solid-svg-icons';
import Home from './Home';
import Notification from './Notification';

const Tab = createBottomTabNavigator();



const Direction = () => {

  return (


<Tab.Navigator
screenOptions={() => ({
      tabBarActiveBackgroundColor: 'black',
      tabBarActiveTintColor: '#FFF',
      tabBarActiveIconStyle: { borderRadius: 5, backgroundColor: 'blue' },
      tabBarShowLabel: true,
      tabBarStyle: { backgroundColor: '#000' },
      headerLeftContainerStyle: {
            paddingLeft: 15,
      },
      headerRightContainerStyle: {
            paddingRight: 15,
      },


})}
>
<Tab.Screen
      name="Home"
      component={Home}
      options={{
            headerTitle: '',
            headerTransparent: true,
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
                  <FontAwesomeIcon icon={faCamera} size={size} color={color} />
                ),
            headerTitleAlign: 'center',
            headerLeftContainerStyle: {
                  paddingLeft: 35,
            },
            headerRightContainerStyle: {
                  paddingRight: 35,
            },



      }}
/>


<Tab.Screen
      name="Notification"
      component={Notification}
      options={{
            headerTitle: '',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
                  <FontAwesomeIcon icon={faList} size={size} color={color} />
                ),
            headerTitleAlign: 'center',


      }}
/>


</Tab.Navigator>

  );
};

export default Direction;