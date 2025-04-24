# Admission Jockey Backend Documentation

## Overview
Admission Jockey backend is a microservices-based architecture designed to support an AI-powered career counseling platform. Each microservice is independently deployable, has its own database, and communicates via REST APIs. The API Gateway routes requests to the appropriate services using service discovery.

## Backend Setup
- Each microservice runs in its own directory with a Node.js Express server.
- MongoDB is used as the primary database for all services.
- Redis and RabbitMQ are used for caching and messaging where applicable.
- Service Discovery is implemented using Consul.
- The API Gateway handles authentication, routing, rate limiting, and logging.

### Running the Backend
- Navigate to the `admission-jockey-backend` directory.
- Run `npm install` in each service directory to install dependencies.
- Start each service individually using `npm start` or use Docker Compose if configured.
- The API Gateway listens on port 3000 by default.

# Admission Jockey Backend - Detailed API Documentation

## Auth Service

### Register User
- **URL:** `/auth/register`
- **Method:** POST
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```
- **Response:**
```json
{
  "message": "User registered successfully",
  "userId": "1234567890abcdef"
}
```

### Login User
- **URL:** `/auth/login`
- **Method:** POST
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "token": "jwt-token-string",
  "refreshToken": "refresh-token-string",
  "expiresIn": 3600
}
```

### Refresh Token
- **URL:** `/auth/refresh-token`
- **Method:** POST
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "refreshToken": "refresh-token-string"
}
```
- **Response:**
```json
{
  "token": "new-jwt-token-string",
  "expiresIn": 3600
}
```

### Forgot Password
- **URL:** `/auth/forgot-password`
- **Method:** POST
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "email": "user@example.com"
}
```
- **Response:**
```json
{
  "message": "Password reset email sent"
}
```

### Reset Password
- **URL:** `/auth/reset-password`
- **Method:** POST
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "token": "reset-token-string",
  "newPassword": "newpassword123"
}
```
- **Response:**
```json
{
  "message": "Password reset successful"
}
```

### Verify Email
- **URL:** `/auth/verify-email/:token`
- **Method:** GET
- **Response:**
```json
{
  "message": "Email verified successfully"
}
```

---

## User Service

### Get User Profile
- **URL:** `/users/:userId`
- **Method:** GET
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "userId": "1234567890abcdef",
  "name": "John Doe",
  "email": "user@example.com",
  "education": [
    {
      "degree": "BSc Computer Science",
      "institution": "University A",
      "year": 2020
    }
  ],
  "preferences": {
    "careerGoals": ["Software Engineer", "Data Scientist"],
    "locations": ["San Francisco", "New York"]
  },
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

### Update User Profile
- **URL:** `/users/:userId`
- **Method:** PUT
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body:**
```json
{
  "name": "John Doe Updated",
  "preferences": {
    "careerGoals": ["Product Manager"],
    "locations": ["Seattle"]
  }
}
```
- **Response:**
```json
{
  "message": "User profile updated successfully"
}
```

### Add Education Record
- **URL:** `/users/:userId/education`
- **Method:** POST
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body:**
```json
{
  "degree": "MSc Data Science",
  "institution": "University B",
  "year": 2022
}
```
- **Response:**
```json
{
  "message": "Education record added successfully"
}
```

### Update User Preferences
- **URL:** `/users/:userId/preferences`
- **Method:** PUT
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body:**
```json
{
  "careerGoals": ["Data Analyst"],
  "locations": ["Boston"]
}
```
- **Response:**
```json
{
  "message": "User preferences updated successfully"
}
```

### Upload User Avatar
- **URL:** `/users/:userId/avatar`
- **Method:** POST
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- **Request Body:** Form data with file field `avatar`
- **Response:**
```json
{
  "message": "Avatar uploaded successfully",
  "avatarUrl": "https://example.com/new-avatar.jpg"
}
```

---

## College Service

### List Colleges
- **URL:** `/colleges`
- **Method:** GET
- **Headers:** `Authorization: Bearer <token>` (optional)
- **Query Parameters:** Optional filters (e.g., `?state=California&rating=4`)
- **Response:**
```json
[
  {
    "collegeId": "abc123",
    "name": "University A",
    "state": "California",
    "rating": 4.5
  },
  {
    "collegeId": "def456",
    "name": "College B",
    "state": "New York",
    "rating": 4.0
  }
]
```

### Get College Details
- **URL:** `/colleges/:collegeId`
- **Method:** GET
- **Headers:** `Authorization: Bearer <token>` (optional)
- **Response:**
```json
{
  "collegeId": "abc123",
  "name": "University A",
  "address": "123 Main St, City, State",
  "phone": "123-456-7890",
  "email": "info@universitya.edu",
  "website": "https://universitya.edu"
}
```

### Get Courses Offered by College
- **URL:** `/colleges/:collegeId/courses`
- **Method:** GET
- **Headers:** `Authorization: Bearer <token>` (optional)
- **Response:**
```json
[
  {
    "courseId": "c1",
    "name": "Computer Science",
    "duration": "4 years"
  },
  {
    "courseId": "c2",
    "name": "Business Administration",
    "duration": "3 years"
  }
]
```

### Get College Reviews
- **URL:** `/colleges/:collegeId/reviews`
- **Method:** GET
- **Headers:** `Authorization: Bearer <token>` (optional)
- **Response:**
```json
[
  {
    "reviewId": "r1",
    "userId": "u123",
    "rating": 5,
    "comment": "Great college with excellent faculty."
  },
  {
    "reviewId": "r2",
    "userId": "u456",
    "rating": 4,
    "comment": "Good campus and facilities."
  }
]
```

---

## Chatbot Gateway

### Send Chat Message
- **URL:** `/chat/message`
- **Method:** POST
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body:**
```json
{
  "userId": "u123",
  "message": "What are the best colleges for computer science?"
}
```
- **Response:**
```json
{
  "reply": "The top colleges for computer science are University A, College B, and Institute C."
}
```

### Send Voice Input
- **URL:** `/chat/voice`
- **Method:** POST
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body:**
```json
{
  "userId": "u123",
  "audioData": "base64-encoded-audio-string"
}
```
- **Response:**
```json
{
  "reply": "I heard you ask about scholarships. Here are some options..."
}
```

### Get Chat History
- **URL:** `/chat/history/:userId`
- **Method:** GET
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
[
  {
    "messageId": "m1",
    "userMessage": "What are the best colleges?",
    "botReply": "The top colleges are..."
  },
  {
    "messageId": "m2",
    "userMessage": "What about scholarships?",
    "botReply": "Here are some scholarships..."
  }
]
```

### Submit Chat Feedback
- **URL:** `/chat/feedback`
- **Method:** POST
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body:**
```json
{
  "userId": "u123",
  "messageId": "m2",
  "rating": 4,
  "comments": "Helpful response"
}
```
- **Response:**
```json
{
  "message": "Feedback submitted successfully"
}
```

---

## Application Service

### List Applications
- **URL:** `/applications`
- **Method:** GET
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:** Optional filters (e.g., `?status=pending`)
- **Response:**
```json
[
  {
    "applicationId": "app123",
    "userId": "u123",
    "collegeId": "abc123",
    "status": "pending"
  }
]
```

### Create New Application
- **URL:** `/applications`
- **Method:** POST
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body:**
```json
{
  "userId": "u123",
  "collegeId": "abc123",
  "formData": {
    "field1": "value1",
    "field2": "value2"
  }
}
```
- **Response:**
```json
{
  "message": "Application created successfully",
  "applicationId": "app123"
}
```

### Update Application
- **URL:** `/applications/:id`
- **Method:** PUT
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body:** Partial or full application data
- **Response:**
```json
{
  "message": "Application updated successfully"
}
```

### Get Application Status
- **URL:** `/applications/:id/status`
- **Method:** GET
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "applicationId": "app123",
  "status": "approved"
}
```

### Upload Application Documents
- **URL:** `/applications/:id/documents`
- **Method:** POST
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- **Request Body:** Form data with file fields
- **Response:**
```json
{
  "message": "Documents uploaded successfully"
}
```

### Get Application Form for College
- **URL:** `/forms/:collegeId`
- **Method:** GET
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "collegeId": "abc123",
  "formFields": [
    {
      "fieldName": "First Name",
      "fieldType": "text",
      "required": true
    }
  ]
}
```

---

## Alumni Service

### List Alumni
- **URL:** `/alumni`
- **Method:** GET
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:** Optional filters
- **Response:**
```json
[
  {
    "alumniId": "al123",
    "name": "Jane Smith",
    "graduationYear": 2015
  }
]
```

### Get Alumni Profile
- **URL:** `/alumni/:id`
- **Method:** GET
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "alumniId": "al123",
  "name": "Jane Smith",
  "bio": "Software Engineer at XYZ",
  "connections": 50
}
```

### Send Connection Request
- **URL:** `/alumni/:id/connect`
- **Method:** POST
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body:**
```json
{
  "message": "I'd like to connect with you."
}
```
- **Response:**
```json
{
  "message": "Connection request sent"
}
```

### Send Message to Alumni
- **URL:** `/alumni/:id/messages`
- **Method:** POST
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body:**
```json
{
  "message": "Hello, I am interested in your career path."
}
```
- **Response:**
```json
{
  "message": "Message sent successfully"
}
```

### List User Connections
- **URL:** `/alumni/connections`
- **Method:** GET
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
[
  {
    "connectionId": "conn123",
    "name": "John Doe"
  }
]
```

### List User Messages
- **URL:** `/alumni/messages`
- **Method:** GET
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
[
  {
    "messageId": "msg123",
    "from": "Jane Smith",
    "content": "Hello!"
  }
]
```

---

## Calendar Service

### List Events
- **URL:** `/calendar/events`
- **Method:** GET
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:** Optional filters
- **Response:**
```json
[
  {
    "eventId": "ev123",
    "title": "Career Fair",
    "date": "2024-07-01"
  }
]
```

### Create Event
- **URL:** `/calendar/events`
- **Method:** POST
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body:**
```json
{
  "title": "Career Fair",
  "date": "2024-07-01",
  "description": "Annual career fair event"
}
```
- **Response:**
```json
{
  "message": "Event created successfully",
  "eventId": "ev123"
}
```

### Update Event
- **URL:** `/calendar/events/:id`
- **Method:** PUT
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body:** Partial or full event data
- **Response:**
```json
{
  "message": "Event updated successfully"
}
```

### Delete Event
- **URL:** `/calendar/events/:id`
- **Method:** DELETE
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "message": "Event deleted successfully"
}
```

### Create Reminder
- **URL:** `/calendar/reminders`
- **Method:** POST
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body:**
```json
{
  "title": "Submit Application",
  "date": "2024-06-15"
}
```
- **Response:**
```json
{
  "message": "Reminder created successfully",
  "reminderId": "rem123"
}
```

### List Reminders
- **URL:** `/calendar/reminders`
- **Method:** GET
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:** Optional filters
- **Response:**
```json
[
  {
    "reminderId": "rem123",
    "title": "Submit Application",
    "date": "2024-06-15"
  }
]
```

### Update Reminder
- **URL:** `/calendar/reminders/:id`
- **Method:** PUT
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body:** Partial or full reminder data
- **Response:**
```json
{
  "message": "Reminder updated successfully"
}
```

### Delete Reminder
- **URL:** `/calendar/reminders/:id`
- **Method:** DELETE
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "message": "Reminder deleted successfully"
}
```

---

## Payment Service

### Create Payment
- **URL:** `/payments`
- **Method:** POST
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body:**
```json
{
  "userId": "u123",
  "amount": 100.00,
  "paymentMethod": "credit_card",
  "details": {
    "cardNumber": "4111111111111111",
    "expiry": "12/25",
    "cvv": "123"
  }
}
```
- **Response:**
```json
{
  "message": "Payment processed successfully",
  "paymentId": "pay123"
}
```

### Get Payment Details
- **URL:** `/payments/:id`
- **Method:** GET
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "paymentId": "pay123",
  "status": "completed",
  "amount": 100.00,
  "date": "2024-06-01"
}
```

### List Payments
- **URL:** `/payments`
- **Method:** GET
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:** Optional filters
- **Response:**
```json
[
  {
    "paymentId": "pay123",
    "status": "completed",
    "amount": 100.00,
    "date": "2024-06-01"
  }
]
```

### Razorpay Webhook
- **URL:** `/webhooks/razorpay`
- **Method:** POST
- **Headers:** `Content-Type: application/json`
- **Request Body:** Razorpay webhook payload
- **Response:**
```json
{
  "message": "Webhook received"
}
```

### Stripe Webhook
- **URL:** `/webhooks/stripe`
- **Method:** POST
- **Headers:** `Content-Type: application/json`
- **Request Body:** Stripe webhook payload
- **Response:**
```json
{
  "message": "Webhook received"
}
```

---

## Notification Service

### Send Email Notification
- **URL:** `/notifications/email`
- **Method:** POST
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body:**
```json
{
  "to": "user@example.com",
  "subject": "Welcome",
  "body": "Thank you for registering."
}
```
- **Response:**
```json
{
  "message": "Email sent successfully"
}
```

### Send Push Notification
- **URL:** `/notifications/push`
- **Method:** POST
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body:**
```json
{
  "userId": "u123",
  "title": "New Message",
  "body": "You have a new message."
}
```
- **Response:**
```json
{
  "message": "Push notification sent successfully"
}
```

### List Notifications
- **URL:** `/notifications`
- **Method:** GET
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:** Optional filters
- **Response:**
```json
[
  {
    "notificationId": "notif123",
    "title": "Welcome",
    "body": "Thank you for registering.",
    "read": false
  }
]
```

### Mark Notification as Read
- **URL:** `/notifications/:id/read`
- **Method:** PUT
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "message": "Notification marked as read"
}
```

---

## Message Queue Service

### Publish Event to Message Queue
- **URL:** `/message-queue/publish`
- **Method:** POST
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "queue": "eventQueue",
  "message": {
    "eventType": "userRegistered",
    "data": {
      "userId": "1234567890abcdef"
    }
  }
}
```
- **Response:**
```json
{
  "message": "Event published successfully"
}
```

---

## Service Discovery
Services register with Consul for dynamic discovery. The API Gateway uses Consul to route requests to healthy service instances.

## Frontend Integration
Frontend clients should send API requests to the API Gateway endpoints listed above. Authentication tokens (JWT) are required for protected routes.

## Troubleshooting
- Ensure MongoDB and RabbitMQ are running and accessible.
- Check service logs for errors.
- Verify environment variables are correctly set.
- Use Consul UI to monitor service registrations.

## Contact
For questions or issues, contact the backend development team.

---