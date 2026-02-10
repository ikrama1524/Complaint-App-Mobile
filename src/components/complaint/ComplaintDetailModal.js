import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { complaintService } from '../../api/complaintService';
import { COLORS, STATUS_COLORS } from '../../utils/constants';

export default function ComplaintDetailModal({ visible, onClose, complaintId }) {
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (visible && complaintId) {
            fetchComplaintDetails();
        }
    }, [visible, complaintId]);

    const fetchComplaintDetails = async () => {
        setLoading(true);
        try {
            const data = await complaintService.getComplaintById(complaintId);
            setComplaint(data);
        } catch (error) {
            console.error('Failed to fetch complaint details:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        return STATUS_COLORS[status] || COLORS.gray;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Complaint Details</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={COLORS.black} />
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                        </View>
                    ) : complaint ? (
                        <ScrollView style={styles.content}>
                            {/* Status Badge */}
                            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(complaint.status) }]}>
                                <Text style={styles.statusText}>{complaint.status}</Text>
                            </View>

                            {/* Title */}
                            <Text style={styles.complaintTitle}>{complaint.title}</Text>

                            {/* Info Grid */}
                            <View style={styles.infoGrid}>
                                <InfoItem
                                    icon="calendar-outline"
                                    label="Created"
                                    value={formatDate(complaint.createdAt)}
                                />
                                <InfoItem
                                    icon="pricetag-outline"
                                    label="Type"
                                    value={complaint.complaintType}
                                />
                                <InfoItem
                                    icon="location-outline"
                                    label="Location"
                                    value={complaint.locationText || 'Not specified'}
                                />
                            </View>

                            {/* Description */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Description</Text>
                                <Text style={styles.description}>{complaint.description}</Text>
                            </View>

                            {/* Images */}
                            {complaint.attachments && complaint.attachments.length > 0 && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Attachments</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        {complaint.attachments.map((attachment, index) => (
                                            <View key={index} style={styles.imagePlaceholder}>
                                                <Ionicons name="image-outline" size={40} color={COLORS.gray} />
                                                <Text style={styles.imageText}>Image {index + 1}</Text>
                                            </View>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}

                            {/* Read-Only Notice */}
                            <View style={styles.notice}>
                                <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
                                <Text style={styles.noticeText}>
                                    This is a read-only view. Status updates are managed by administrators.
                                </Text>
                            </View>
                        </ScrollView>
                    ) : (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>Failed to load complaint details</Text>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
}

function InfoItem({ icon, label, value }) {
    return (
        <View style={styles.infoItem}>
            <Ionicons name={icon} size={20} color={COLORS.primary} />
            <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
        marginBottom: 16,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.white,
    },
    complaintTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 20,
    },
    infoGrid: {
        marginBottom: 24,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    infoTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: COLORS.gray,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.black,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.black,
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        color: COLORS.gray,
        lineHeight: 22,
    },
    imagePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 12,
        backgroundColor: COLORS.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    imageText: {
        fontSize: 12,
        color: COLORS.gray,
        marginTop: 8,
    },
    notice: {
        flexDirection: 'row',
        backgroundColor: '#e0f2fe',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    noticeText: {
        flex: 1,
        fontSize: 13,
        color: COLORS.primary,
        marginLeft: 12,
        lineHeight: 18,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: COLORS.danger,
    },
});
