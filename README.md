# VIDMAN

# Getting Started

Clone the repository:

```bash
git clone git@github.com:2k4sm/VIDMAN.git
```

# Getting Started with the Backend.

To get started follow these steps:

INSTALL BUN
```
curl -fsSL https://bun.sh/install | bash
```

1. Navigate to the project directory:

   ```bash
   cd ./VIDMAN
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

   or

   ```bash
   bun install
   ```

3. Set up the environment variables:

   - Create a `.env` file in the root directory.
   - Add the following variables to the `.env` file:
     ```bash
     SUPABASE_URL=<supabase-url>
     SUPABASE_ANON_KEY=<anon-key>
     JAAT_KEY=<jwt-secret-key>
     DEPLOYED_INSTANCE=<hostname + port or deployed instance base url>
     PORT=<server-port to run on.>
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   bun run dev
   ```


# Technical Requirement Documentation.

## Overview

These API's allows users to upload and manipulate videos. The available operations include uploading videos with configurable limits, trimming videos, merging video clips, and generating shareable links with time-based expiry.

## Requirements

1. **Authentication**: All API calls must be authenticated using static API tokens.
2. **Video Upload**: Users can upload videos with configurable limits of size and duration.
   - Maximum size: `25 mb`
3. **Video Trimming**: Users can trim a previously uploaded video from the start or end.
4. **Video Merging**: Users can merge a list of previously uploaded video clips into a single video file.
5. **Link Sharing**: Users can generate shareable links with a time-based expiry.
6. **Testing**: Unit and end-to-end (e2e) tests must be written.
7. **Database**: SQLite is used as the database and should be committed to the repository.
8. **API Documentation**: API documentation should be provided as a Swagger Endpoint or Postman Collection JSON.

## API Endpoints

### Authentication

- **Endpoint**: `/auth/login`
- **Method**: `POST`
- **Description**: Authenticates API calls using static API tokens.
- **Request Body**:
  - `email` : user email.
  - `password` : user password
- **Response**:

  - `200 OK` : token : <auth-token>
  - `401 Unauthorized` : Invalid API token

- **Endpoint**: `/auth/register`
- **Method**: `POST`
- **Description**: Authenticates API calls using static API tokens.
- **Request Body**:
  - `email` : user email.
  - `password` : user password
- **Response**:
  - `200 OK` : token : <auth-token>
  - `401 Unauthorized` : Invalid API token

### Upload Video

- **Endpoint**: `/videos/upload`
- **Method**: `POST`
- **Description**: Uploads a video with configurable size and duration limits.
- **Request Headers**:
  - `Authorization` : `Bearer <API_TOKEN>`
- **Request Body**:
  - `file` : Video file
  - `maxSize` : Maximum size (e.g., `25mb` )
- **Response**:
  - `201 Created` : Video uploaded successfully
  - `400 Bad Request` : Invalid file or configuration

### Trim Video

- **Endpoint**: `/videos/trim`
- **Method**: `POST`
- **Description**: Trims a previously uploaded video from the start or end.
- **Request Headers**:
  - `Authorization` : `Bearer <API_TOKEN>`
- **Request Body**:
  - `videoId` : ID of the video to be trimmed
  - `startTime` : Start time for trimming
  - `endTime` : End time for trimming
- **Response**:
  - `200 OK` : Video trimmed successfully
  - `400 Bad Request` : Invalid video ID or time parameters

### Merge Videos

- **Endpoint**: `/videos/merge`
- **Method**: `POST`
- **Description**: Merges a list of previously uploaded video clips into a single video file.
- **Request Headers**:
  - `Authorization` : `Bearer <API_TOKEN>`
- **Request Body**:
  - `videoIds` : List of video IDs to be merged
- **Response**:
  - `200 OK` : Videos merged successfully
  - `400 Bad Request` : Invalid video IDs

### Generate Shareable Link

- **Endpoint**: `/videos/share`
- **Method**: `POST`
- **Description**: Generates a shareable link with a time-based expiry.
- **Request Headers**:
  - `Authorization` : `Bearer <API_TOKEN>`
- **Request Body**:
  - `videoId` : ID of the video to be shared
  - `expiryTime` : Expiry time for the link
- **Response**:
  - `200 OK` : Shareable link generated successfully
  - `400 Bad Request` : Invalid video ID or expiry time

## Testing

- **Unit Tests**: Ensure all individual components function correctly.
- **End-to-End (e2e) Tests**: Validate the entire workflow from video upload to manipulation and sharing.

## Database

- **SQLite**: The database used for storing video metadata and user information. The database file should be committed to the repository.
- Sequelize: For simplicity this ORM will be used.

## Assumptions and Choices

- **Authentication**: Static API tokens are used for simplicity and security.
- **Video Limits**: Configurable limits for video size and duration are implemented to provide flexibility.
- **Error Handling**: Appropriate exception handling and error messages are included to improve user experience.

## Example API Calls

### Upload Video Example

```bash
curl -X POST "https://api.example.com/videos/upload" \
-H "Authorization: Bearer <API_TOKEN>" \
-F "file=@/path/to/video.mp4" \
```

### Trim Video Example

```bash
curl -X POST "https://api.example.com/videos/trim" \
-H "Authorization: Bearer <API_TOKEN>" \
-d '{"videoId": "12345", "startTime": "00:00:01", "endTime": "00:00:05"}'
```

### Merge Videos Example

```bash
curl -X POST "https://api.example.com/api/videos/merge" \
-H "Authorization: Bearer <API_TOKEN>" \
-d '{"videoIds": ["12345", "67890"]}'
```

### Generate Shareable Link Example

```bash
curl -X POST "https://api.example.com/api/videos/share" \
-H "Authorization: Bearer <API_TOKEN>" \
-d '{"videoId": "12345", "expiryTime": 3600}'
```

## Conclusion

This documentation provides an overview of the VIDMAN API's, including requirements, endpoints, testing, database usage, assumptions, and example API calls. For further details, please refer to the provided references.

## References

- [Supabase Documentation ](https://supabase.com/docs/reference/javascript/storage-from-upload)
- [fluent-ffmpeg documentation](https://www.npmjs.com/package/fluent-ffmpeg)
