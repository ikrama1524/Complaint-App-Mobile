// Role constants matching backend
export const ROLES = {
    CITIZEN: 'ROLE_CITIZEN',
    ADMIN: 'ROLE_ADMIN',
    SUPER_ADMIN: 'ROLE_SUPER_ADMIN'
};

// Complaint status matching backend
export const COMPLAINT_STATUS = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    RESOLVED: 'RESOLVED',
    REJECTED: 'REJECTED'
};

// Complaint types matching backend
export const COMPLAINT_TYPES = [
    { value: 'ROAD_DAMAGE', label: 'Road Damage' },
    { value: 'STREET_LIGHT', label: 'Street Light Issue' },
    { value: 'GARBAGE_COLLECTION', label: 'Garbage Collection' },
    { value: 'WATER_SUPPLY', label: 'Water Supply' },
    { value: 'DRAINAGE', label: 'Drainage Problem' },
    { value: 'ILLEGAL_CONSTRUCTION', label: 'Illegal Construction' },
    { value: 'NOISE_POLLUTION', label: 'Noise Pollution' },
    { value: 'PUBLIC_PROPERTY_DAMAGE', label: 'Public Property Damage' },
    { value: 'OTHER', label: 'Other' }
];

// API base URL - CHANGE THIS TO YOUR BACKEND URL
export const API_BASE_URL = 'http://10.0.2.2:8080'; // Android emulator localhost

// Default map location (Pune, Maharashtra)
export const DEFAULT_LOCATION = {
    latitude: 18.5204,
    longitude: 73.8567,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

// Colors
export const COLORS = {
    primary: '#2563eb',
    secondary: '#4f46e5',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    gray: '#6b7280',
    lightGray: '#f3f4f6',
    white: '#ffffff',
    black: '#000000',
};

// Status colors
export const STATUS_COLORS = {
    PENDING: '#f59e0b',
    IN_PROGRESS: '#3b82f6',
    RESOLVED: '#10b981',
    REJECTED: '#ef4444',
};
