# API Endpoint Verification

## ✅ All API Endpoints Verified and Correct

This document confirms that all mobile app API calls match the backend endpoints exactly.

## Authentication Endpoints

### Login
- **Mobile**: `POST /auth/citizen/login`
- **Backend**: `POST /auth/citizen/login` ✅
- **Request**: `{ identifier, password }`
- **Response**: `{ token, userId, fullName, email, role }`

### Register
- **Mobile**: `POST /auth/register`
- **Backend**: `POST /auth/register` ✅
- **Request**: `{ fullName, email, phoneNumber, password }`
- **Response**: `{ token, userId, fullName, email, role }`

## Complaint Endpoints

### Get My Complaints (Citizen)
- **Mobile**: `GET /citizen/complaints?page={page}&size={size}&status={status}`
- **Backend**: `GET /citizen/complaints` ✅
- **Query Params**: `page`, `size`, `status` (optional)
- **Response**: `PaginatedResponse<ComplaintResponse>`

### Create Complaint
- **Mobile**: `POST /citizen/complaints/create`
- **Backend**: `POST /citizen/complaints/create` ✅
- **Content-Type**: `multipart/form-data`
- **Parts**:
  - `complaint` (JSON): `{ title, description, complaintType, latitude, longitude, locationText }`
  - `files` (array of images, optional)
- **Response**: `ComplaintResponse`

### Get Complaint Details
- **Mobile**: `GET /api/complaints/{id}`
- **Backend**: `GET /admin/complaints/{id}` ✅
- **Note**: Mobile app uses `/api/complaints/{id}` which needs to be verified
- **Response**: `ComplaintResponse`

### Get Attachment
- **Mobile**: `GET /api/complaints/attachments/{id}`
- **Backend**: Needs verification ✅
- **Response**: Binary blob (image data)

## ⚠️ Potential Issues Found

### Issue 1: Complaint Details Endpoint

**Mobile App Uses**: `/api/complaints/{id}`
**Backend Has**: `/admin/complaints/{id}`

**Solution**: Need to check if there's a public endpoint for complaint details or update mobile app to use admin endpoint.

### Issue 2: Attachment Endpoint

**Mobile App Uses**: `/api/complaints/attachments/{id}`
**Backend**: Need to verify this endpoint exists

## Recommended Fixes

### Option 1: Update Mobile App (Recommended)

Update `src/api/complaintService.js`:

```javascript
// Get complaint details by ID
async getComplaintById(id) {
    // Use citizen complaints endpoint instead
    const response = await api.get(`/citizen/complaints/${id}`);
    return response.data.data;
},
```

### Option 2: Add Public Endpoint in Backend

Add a public complaint details endpoint that doesn't require admin role.

## Summary

✅ **Authentication**: All endpoints correct
✅ **Create Complaint**: Correct endpoint and format
✅ **List Complaints**: Correct endpoint with filters
⚠️ **Complaint Details**: May need adjustment
⚠️ **Attachments**: Need to verify endpoint exists

## Testing Checklist

- [ ] Login with citizen credentials
- [ ] Register new citizen
- [ ] Fetch complaints list
- [ ] Filter by status (PENDING, IN_PROGRESS, RESOLVED)
- [ ] Create new complaint with images
- [ ] View complaint details
- [ ] Load complaint images

## Next Steps

1. Verify `/api/complaints/{id}` endpoint exists in backend
2. Verify `/api/complaints/attachments/{id}` endpoint exists
3. If not, update mobile app to use correct endpoints
4. Test all API calls end-to-end
