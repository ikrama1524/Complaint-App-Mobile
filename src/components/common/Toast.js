import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../utils/constants';

export default function Toast({ visible, message, type = 'success', onHide }) {
    const translateY = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();

            const timer = setTimeout(() => {
                hide();
            }, 3000);

            return () => clearTimeout(timer);
        } else {
            hide();
        }
    }, [visible]);

    const hide = () => {
        Animated.timing(translateY, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            if (onHide && visible) onHide();
        });
    };

    const backgroundColor = type === 'success' ? '#4CAF50' : '#F44336'; // Green or Red
    const iconName = type === 'success' ? 'checkmark-circle' : 'alert-circle';

    return (
        <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
            <View style={[styles.content, { backgroundColor }]}>
                <Ionicons name={iconName} size={24} color="white" />
                <Text style={styles.text}>{message}</Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 40, // Adjust for status bar
        left: 20,
        right: 20,
        zIndex: 9999,
        elevation: 10,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    text: {
        color: 'white',
        fontWeight: '600',
        marginLeft: 12,
        fontSize: 14,
        flex: 1,
    },
});
