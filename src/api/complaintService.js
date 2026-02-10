import api from './axios';

export const complaintService = {
    // Get complaints for citizen with optional status filter
    async getMyComplaints(status = null, page = 0, size = 10) {
        const params = { page, size };
        if (status) {
            params.status = status;
        }
        const response = await api.get('/citizen/complaints', { params });
        return response.data.data; // Returns PaginatedResponse
    },

    // Get complaint details by ID
    async getComplaintById(id) {
        const response = await api.get(`/api/complaints/${id}`);
        return response.data.data;
    },

    // Create new complaint with multipart form data
    async createComplaint(complaintData, images = []) {
        const formData = new FormData();

        // Append complaint JSON as blob
        const complaintBlob = {
            uri: 'data:application/json;charset=utf-8,' + JSON.stringify(complaintData),
            type: 'application/json',
            name: 'complaint'
        };
        formData.append('complaint', complaintBlob);

        // Append images
        images.forEach((image, index) => {
            const imageFile = {
                uri: image.uri,
                type: image.type || 'image/jpeg',
                name: image.fileName || `image_${index}.jpg`
            };
            formData.append('files', imageFile);
        });

        const response = await api.post('/citizen/complaints/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    // Fetch image attachment as blob
    async getAttachment(attachmentId) {
        const response = await api.get(`/api/complaints/attachments/${attachmentId}`, {
            responseType: 'blob'
        });
        return response.data;
    },
};
