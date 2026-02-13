import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';
import { complaintService } from '../../api/complaintService';
import { COLORS, COMPLAINT_TYPES, DEFAULT_LOCATION } from '../../utils/constants';
import Toast from '../../components/common/Toast';

export default function CreateComplaintScreen({ navigation }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        complaintType: 'ROAD_DAMAGE',
        latitude: DEFAULT_LOCATION.latitude,
        longitude: DEFAULT_LOCATION.longitude,
        locationText: ''
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);

    // Toast State
    const [toast, setToast] = useState({
        visible: false,
        message: '',
        type: 'success'
    });

    useEffect(() => {
        requestPermissions();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ visible: true, message, type });
        setTimeout(() => {
            setToast(prev => ({ ...prev, visible: false }));
        }, 3000);
    };

    const requestPermissions = async () => {
        const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        const { status: imageStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (locationStatus === 'granted') {
            getCurrentLocation();
        }
    };

    const getCurrentLocation = async () => {
        setLocationLoading(true);
        try {
            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            updateLocation(latitude, longitude);
        } catch (error) {
            console.error('Failed to get location:', error);
            showToast('Failed to get current location', 'error');
        } finally {
            setLocationLoading(false);
        }
    };

    const updateLocation = async (latitude, longitude) => {
        setFormData(prev => ({
            ...prev,
            latitude,
            longitude
        }));

        try {
            const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (addresses.length > 0) {
                const address = addresses[0];
                const parts = [
                    address.name,
                    address.street,
                    address.district,
                    address.city,
                    address.region,
                    address.postalCode
                ].filter(Boolean);

                const locationText = parts.join(', ');
                setFormData(prev => ({ ...prev, locationText }));
            }
        } catch (error) {
            console.log('Reverse geocoding error', error);
        }
    };

    const handleMapPress = (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        updateLocation(latitude, longitude);
    };

    const pickImage = async () => {
        if (images.length >= 3) {
            showToast('You can upload maximum 3 images', 'error');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImages([...images, {
                uri: result.assets[0].uri,
                type: 'image/jpeg',
                fileName: `complaint_${Date.now()}.jpg`
            }]);
        }
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.description) {
            showToast('Please fill in title and description', 'error');
            return;
        }

        setLoading(true);
        try {
            const complaintData = {
                title: formData.title,
                description: formData.description,
                complaintType: formData.complaintType,
                latitude: formData.latitude,
                longitude: formData.longitude,
                locationText: formData.locationText || `${formData.latitude}, ${formData.longitude}`
            };

            const response = await complaintService.createComplaint(complaintData, images);
            const successMsg = response?.message || 'Complaint submitted successfully!';

            showToast(successMsg, 'success');

            setTimeout(() => {
                setFormData({
                    title: '',
                    description: '',
                    complaintType: 'ROAD_DAMAGE',
                    latitude: DEFAULT_LOCATION.latitude,
                    longitude: DEFAULT_LOCATION.longitude,
                    locationText: ''
                });
                setImages([]);
                navigation.navigate('Home');
            }, 1000);

        } catch (error) {
            console.error('Failed to create complaint:', error);
            const errorMsg = error.response?.data?.message || 'Failed to submit complaint. Please try again.';
            showToast(errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                onHide={() => setToast(prev => ({ ...prev, visible: false }))}
            />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>New Complaint</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>

                    {/* 1. Title */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Title *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Brief title of the complaint"
                            value={formData.title}
                            onChangeText={(text) => setFormData({ ...formData, title: text })}
                        />
                    </View>

                    {/* 2. Complaint Type (Reordered to match Web) */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Complaint Type *</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={formData.complaintType}
                                onValueChange={(value) => setFormData({ ...formData, complaintType: value })}
                                style={styles.picker}
                            >
                                {COMPLAINT_TYPES.map(type => (
                                    <Picker.Item key={type.value} label={type.label} value={type.value} />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    {/* 3. Description (Reordered to match Web) */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Description *</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Detailed description of the issue"
                            value={formData.description}
                            onChangeText={(text) => setFormData({ ...formData, description: text })}
                            multiline
                            numberOfLines={4}
                        />
                    </View>

                    {/* 4. Location */}
                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <Text style={styles.label}>Location</Text>
                            <TouchableOpacity onPress={getCurrentLocation} disabled={locationLoading}>
                                <View style={styles.locateButton}>
                                    <Ionicons name="locate" size={16} color={COLORS.primary} />
                                    <Text style={styles.locateText}>Use Current Location</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.mapContainer}>
                            <MapView
                                style={styles.map}
                                initialRegion={{
                                    latitude: formData.latitude,
                                    longitude: formData.longitude,
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01,
                                }}
                                region={{
                                    latitude: formData.latitude,
                                    longitude: formData.longitude,
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01,
                                }}
                                onPress={handleMapPress}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: formData.latitude,
                                        longitude: formData.longitude,
                                    }}
                                />
                            </MapView>
                            <View style={styles.mapOverlay}>
                                <Text style={styles.mapOverlayText}>Tap map to update</Text>
                            </View>
                        </View>

                        {/* Editable Address Input */}
                        <TextInput
                            style={[styles.input, { marginTop: 12 }]}
                            placeholder="Address"
                            value={formData.locationText}
                            onChangeText={(text) => setFormData({ ...formData, locationText: text })}
                        />
                    </View>

                    {/* 5. Attachments */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Attachments (Max 3)</Text>

                        <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
                            <Ionicons name="cloud-upload-outline" size={32} color={COLORS.gray} />
                            <Text style={styles.uploadText}>Tap to upload images</Text>
                            <Text style={styles.uploadSubText}>Supports JPG, PNG</Text>
                        </TouchableOpacity>

                        {images.length > 0 && (
                            <View style={styles.imageGrid}>
                                {images.map((image, index) => (
                                    <View key={index} style={styles.imagePreviewContainer}>
                                        <Image source={{ uri: image.uri }} style={styles.previewImage} />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage(index)}
                                        >
                                            <Ionicons name="close-circle" size={24} color={COLORS.danger} />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <>
                                <Ionicons name="paper-plane-outline" size={20} color={COLORS.white} />
                                <Text style={styles.submitButtonText}>Submit Complaint</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6', // Maching Web gray-100
    },
    header: {
        backgroundColor: COLORS.primary,
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 0, // Making it flatter like web? No, keep mobile style for header
        borderBottomRightRadius: 0,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151', // gray-700
        marginBottom: 8,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    locateButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locateText: {
        fontSize: 12,
        color: COLORS.primary,
        marginLeft: 4,
        fontWeight: '600',
    },
    input: {
        backgroundColor: COLORS.white,
        borderRadius: 6, // rounded-md
        padding: 12,
        fontSize: 14,
        color: '#111827', // gray-900
        borderWidth: 1,
        borderColor: '#D1D5DB', // gray-300
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    pickerContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        overflow: 'hidden',
    },
    picker: {
        height: 50,
    },
    mapContainer: {
        height: 200,
        borderRadius: 6,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        position: 'relative',
    },
    map: {
        flex: 1,
    },
    mapOverlay: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: 'rgba(255,255,255,0.8)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    mapOverlayText: {
        fontSize: 10,
        color: '#4B5563',
    },
    uploadBox: {
        borderWidth: 2,
        borderColor: '#D1D5DB',
        borderStyle: 'dashed',
        borderRadius: 6,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        marginBottom: 12,
    },
    uploadText: {
        fontSize: 14,
        color: '#4B5563',
        marginTop: 8,
        fontWeight: '500',
    },
    uploadSubText: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4,
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    imagePreviewContainer: {
        width: '31%',
        aspectRatio: 1,
        marginRight: '2%',
        marginBottom: 8,
        position: 'relative',
        borderRadius: 6,
        overflow: 'hidden',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    removeImageButton: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'white',
        borderRadius: 12,
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 6,
        padding: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.white,
        marginLeft: 8,
    },
});
