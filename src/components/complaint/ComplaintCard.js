import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, STATUS_COLORS } from '../../utils/constants';
import ComplaintDetailModal from './ComplaintDetailModal';

export default function ComplaintCard({ complaint }) {
    const [detailModalVisible, setDetailModalVisible] = useState(false);

    const getStatusColor = (status) => {
        return STATUS_COLORS[status] || COLORS.gray;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <>
            <TouchableOpacity
                style={styles.card}
                onPress={() => setDetailModalVisible(true)}
                activeOpacity={0.7}
            >
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title} numberOfLines={1}>
                            {complaint.title}
                        </Text>
                        <Text style={styles.date}>{formatDate(complaint.createdAt)}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(complaint.status) }]}>
                        <Text style={styles.statusText}>{complaint.status}</Text>
                    </View>
                </View>

                <Text style={styles.description} numberOfLines={2}>
                    {complaint.description}
                </Text>

                <View style={styles.footer}>
                    <View style={styles.infoItem}>
                        <Ionicons name="location-outline" size={16} color={COLORS.gray} />
                        <Text style={styles.infoText} numberOfLines={1}>
                            {complaint.locationText || 'Location not specified'}
                        </Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="pricetag-outline" size={16} color={COLORS.gray} />
                        <Text style={styles.infoText}>{complaint.complaintType}</Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Detail Modal */}
            <ComplaintDetailModal
                visible={detailModalVisible}
                onClose={() => setDetailModalVisible(false)}
                complaintId={complaint.id}
            />
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    titleContainer: {
        flex: 1,
        marginRight: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.black,
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        color: COLORS.gray,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.white,
    },
    description: {
        fontSize: 14,
        color: COLORS.gray,
        marginBottom: 12,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    infoText: {
        fontSize: 12,
        color: COLORS.gray,
        marginLeft: 4,
        flex: 1,
    },
});
