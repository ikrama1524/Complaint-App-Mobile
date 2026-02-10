import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, STATUS_COLORS } from '../../utils/constants';

export default function DashboardTile({ title, count, icon, color, onPress }) {
    return (
        <TouchableOpacity
            style={[styles.tile, { backgroundColor: color }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={32} color={COLORS.white} />
            </View>
            <Text style={styles.count}>{count}</Text>
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    tile: {
        width: '48%',
        aspectRatio: 1,
        borderRadius: 16,
        padding: 16,
        justifyContent: 'space-between',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    count: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.white,
    },
});
