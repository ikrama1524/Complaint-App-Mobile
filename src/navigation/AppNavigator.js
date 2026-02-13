import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS, ROLES } from '../utils/constants';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import CreateComplaintScreen from '../screens/complaint/CreateComplaintScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import SuperAdminDashboardScreen from '../screens/admin/SuperAdminDashboardScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator (for authenticated users)
function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Create') {
                        iconName = focused ? 'add-circle' : 'add-circle-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.gray,
                tabBarStyle: {
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                headerShown: false,
            })}
        >
            <Tab.Screen
                name="Home"
                component={DashboardScreen}
                options={{ tabBarLabel: 'Dashboard' }}
            />
            <Tab.Screen
                name="Create"
                component={CreateComplaintScreen}
                options={{ tabBarLabel: 'New Complaint' }}
            />
        </Tab.Navigator>
    );
}

// Auth Stack Navigator (for non-authenticated users)
function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    );
}

// Admin Stack
function AdminStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="AdminDashboard"
                component={AdminDashboardScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

// Super Admin Stack
function SuperAdminStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="SuperAdminDashboard"
                component={SuperAdminDashboardScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

// Main App Navigator
export default function AppNavigator() {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return null; // Or a loading screen
    }

    return (
        <NavigationContainer>
            {!isAuthenticated ? (
                <AuthStack />
            ) : user?.role === ROLES.ADMIN ? (
                <AdminStack />
            ) : user?.role === ROLES.SUPER_ADMIN ? (
                <SuperAdminStack />
            ) : (
                <MainTabs />
            )}
        </NavigationContainer>
    );
}
