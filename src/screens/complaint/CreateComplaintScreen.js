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
    Image
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';
import { complaintService } from '../../api/complaintService';
import { COLORS, COMPLAINT_TYPES, DEFAULT_LOCATION } from '../../utils/constants';

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

    useEffect(() => {
        requestPermissions();
    }, []);

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

            setFormData(prev => ({
                ...prev,
                latitude,
                longitude
            }));

            // Reverse geocode to get address
            const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (addresses.length > 0) {
                const address = addresses[0];
                const locationText = `${address.street || ''}, ${address.city || ''}, ${address.region || ''}`.trim();
                setFormData(prev => ({ ...prev, locationText }));
            }
        } catch (error) {
            console.error('Failed to get location:', error);
        } finally {
            setLocationLoading(false);
        }
    };

    const pickImage = async () => {
        if (images.length >= 3) {
            Alert.alert('Limit Reached', 'You can upload maximum 3 images');
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
            Alert.alert('Error', 'Please fill in title and description');
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

            await complaintService.createComplaint(complaintData, images);

            Alert.alert('Success', 'Complaint submitted successfully', [
                {
                    text: 'OK', onPress: () => {
                        // Reset form
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
                    }
                }
            ]);
        } catch (error) {
            console.error('Failed to create complaint:', error);
            Alert.alert('Error', 'Failed to submit complaint. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>New Complaint</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* Title */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Title *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Brief title of the complaint"
                        value={formData.title}
                        onChangeText={(text) => setFormData({ ...formData, title: text })}
                    />
                </View>

                {/* Description */}
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

                {/* Complaint Type */}
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

                {/* Location */}
                <View style={styles.inputGroup}>
                    <View style={styles.labelRow}>
                        <Text style={styles.label}>Location</Text>
                        <TouchableOpacity onPress={getCurrentLocation} disabled={locationLoading}>
                            <Ionicons
                                name="locate"
                                size={20}
                                color={locationLoading ? COLORS.gray : COLORS.primary}
                            />
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
                        >
                            <Marker
                                coordinate={{
                                    latitude: formData.latitude,
                                    longitude: formData.longitude,
                                }}
                            />
                        </MapView>
                    </View>
                    {formData.locationText && (
                        <Text style={styles.locationText}>{formData.locationText}</Text>
                    )}
                </View>

                {/* Images */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Attachments (Max 3)</Text>
                    <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                        <Ionicons name="camera-outline" size={24} color={COLORS.primary} />
                        <Text style={styles.imageButtonText}>Add Photo</Text>
                    </TouchableOpacity>

                    {images.length > 0 && (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageList}>
                            {images.map((image, index) => (
                                <View key={index} style={styles.imagePreview}>
                                    <Image source={{ uri: image.uri }} style={styles.image} />
                                    <TouchableOpacity
                                        style={styles.removeButton}
                                        onPress={() => removeImage(index)}
                                    >
                                        <Ionicons name="close-circle" size={24} color={COLORS.danger} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
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
                            <Ionicons name="send-outline" size={20} color={COLORS.white} />
                            <Text style={styles.submitButtonText}>Submit Complaint</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray,
    },
    header: {
        backgroundColor: COLORS.primary,
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerTitle: {
        fontSize: 24,
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
        color: COLORS.black,
        marginBottom: 8,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    input: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: COLORS.black,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    pickerContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
    },
    picker: {
        height: 50,
    },
    mapContainer: {
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.lightGray,
    },
    map: {
        flex: 1,
    },
    locationText: {
        fontSize: 12,
        color: COLORS.gray,
        marginTop: 8,
    },
    imageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
    },
    imageButtonText: {
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: '600',
        marginLeft: 8,
    },
    imageList: {
        marginTop: 12,
    },
    imagePreview: {
        position: 'relative',
        marginRight: 12,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 12,
    },
    removeButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: COLORS.white,
        borderRadius: 12,
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.white,
        marginLeft: 8,
    },
});
