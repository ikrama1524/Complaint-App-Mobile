import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/constants';

export default function AdminDashboardScreen() {
    const { user, logout } = useAuth();

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Text style={styles.title}>Admin Dashboard</Text>
            <Text style={styles.subtitle}>Welcome, Corporator {user?.fullName}</Text>

            <TouchableOpacity style={styles.button} onPress={logout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: COLORS.primary,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.gray,
        marginBottom: 20,
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 10,
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
});
