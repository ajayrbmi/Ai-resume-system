const admin = require('firebase-admin');

// Initialize Firebase Admin just with projectId to verify ID tokens
// Make sure to add FIREBASE_PROJECT_ID in your .env later
admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID || 'your-firebase-project-id'
});

module.exports = admin;
