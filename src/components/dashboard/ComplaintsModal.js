import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { complaintService } from '../../api/complaintService';
import ComplaintCard from '../complaint/ComplaintCard';
import { COLORS } from '../../utils/constants';

export default function ComplaintsModal({ visible, onClose, status, statusLabel }) {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        if (visible) {
            fetchComplaints(true);
        }
    }, [visible, status]);

    const fetchComplaints = async (reset = false) => {
        if (loading || (!hasMore && !reset)) return;

        setLoading(true);
        try {
            const currentPage = reset ? 0 : page;
            const response = await complaintService.getMyComplaints(status, currentPage, 10);

            if (reset) {
                setComplaints(response.content || []);
                setPage(0);
            } else {
                setComplaints([...complaints, ...(response.content || [])]);
            }

            setHasMore(!response.last);
            setPage(currentPage + 1);
        } catch (error) {
            console.error('Failed to fetch complaints:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <ComplaintCard complaint={item} />
    );

    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
        );
    };

    const renderEmpty = () => {
        if (loading) return null;
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="folder-open-outline" size={64} color={COLORS.gray} />
                <Text style={styles.emptyText}>No complaints found</Text>
            </View>
        );
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
                        <Text style={styles.title}>{statusLabel}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={COLORS.black} />
                        </TouchableOpacity>
                    </View>

                    {/* Complaints List */}
                    <FlatList
                        data={complaints}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                        onEndReached={() => fetchComplaints(false)}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={renderFooter}
                        ListEmptyComponent={renderEmpty}
                    />
                </View>
            </View>
        </Modal>
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
        height: '85%',
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
    listContent: {
        padding: 16,
    },
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.gray,
        marginTop: 16,
    },
});
