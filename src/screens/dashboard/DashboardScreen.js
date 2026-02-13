import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../api/complaintService';
import DashboardTile from '../../components/dashboard/DashboardTile';
import ComplaintsModal from '../../components/dashboard/ComplaintsModal';
import { COLORS, COMPLAINT_STATUS, STATUS_COLORS } from '../../utils/constants';

export default function DashboardScreen() {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedStatusLabel, setSelectedStatusLabel] = useState('');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch all complaints to calculate stats
            const response = await complaintService.getMyComplaints(null, 0, 1000);
            const complaints = (response && response.content) ? response.content : [];

            const newStats = {
                total: complaints.length,
                pending: complaints.filter(c => c.status === COMPLAINT_STATUS.PENDING).length,
                inProgress: complaints.filter(c => c.status === COMPLAINT_STATUS.IN_PROGRESS).length,
                resolved: complaints.filter(c => c.status === COMPLAINT_STATUS.RESOLVED).length
            };

            setStats(newStats);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchStats();
    }, []);

    const handleTilePress = (status, label) => {
        setSelectedStatus(status);
        setSelectedStatusLabel(label);
        setModalVisible(true);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome back,</Text>
                    <Text style={styles.userName}>{user?.fullName || 'User'}</Text>
                </View>
                <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <Text style={styles.sectionTitle}>My Complaints</Text>

                {/* Dashboard Tiles */}
                <View style={styles.tilesContainer}>
                    <DashboardTile
                        title="All Complaints"
                        count={stats.total}
                        icon="clipboard-outline"
                        color="#4F46E5" // Indigo-600 (Web primary)
                        onPress={() => handleTilePress(null, 'All Complaints')}
                    />
                    <DashboardTile
                        title="Pending"
                        count={stats.pending}
                        icon="time-outline"
                        color="#EAB308" // Yellow-500
                        onPress={() => handleTilePress(COMPLAINT_STATUS.PENDING, 'Pending')}
                    />
                    <DashboardTile
                        title="In Progress"
                        count={stats.inProgress}
                        icon="sync-outline"
                        color="#9333EA" // Purple-600
                        onPress={() => handleTilePress(COMPLAINT_STATUS.IN_PROGRESS, 'In Progress')}
                    />
                    <DashboardTile
                        title="Resolved"
                        count={stats.resolved}
                        icon="checkmark-circle-outline"
                        color="#16A34A" // Green-600
                        onPress={() => handleTilePress(COMPLAINT_STATUS.RESOLVED, 'Resolved')}
                    />
                </View>
            </ScrollView>

            {/* Complaints Modal */}
            <ComplaintsModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                status={selectedStatus}
                statusLabel={selectedStatusLabel}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: COLORS.primary,
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    greeting: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.white,
        marginTop: 4,
    },
    logoutButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 16,
    },
    tilesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
});
