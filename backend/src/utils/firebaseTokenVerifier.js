const admin = require('firebase-admin');
const https = require('https');
const jwt = require('jsonwebtoken');

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'ecommerce-6724e';
const GOOGLE_CERTS_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

// Initialize Firebase Admin SDK if not already initialized
let firebaseAdminInitialized = false;
try {
  const apps = admin.apps || (admin.getApps ? admin.getApps() : []);
  if (!apps.length) {
    admin.initializeApp({
      projectId: FIREBASE_PROJECT_ID,
    });
  }
  firebaseAdminInitialized = true;
  console.log(`[Firebase Admin] Initialized for project: ${FIREBASE_PROJECT_ID}`);
} catch (initErr) {
  console.warn('[Firebase Admin Notice] Default initialization notice:', initErr.message);
}

let cachedCertificates = null;
let cacheExpiresAt = 0;

/**
 * Fetch Google's public certificates with in-memory caching
 */
const getGoogleCertificates = async () => {
  const now = Date.now();
  if (cachedCertificates && now < cacheExpiresAt) {
    return cachedCertificates;
  }

  return new Promise((resolve, reject) => {
    https
      .get(GOOGLE_CERTS_URL, (res) => {
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          try {
            const certs = JSON.parse(rawData);
            // Parse cache-control max-age header if available (defaults to 6 hours)
            let maxAge = 21600;
            const cacheControl = res.headers['cache-control'];
            if (cacheControl) {
              const match = cacheControl.match(/max-age=(\d+)/);
              if (match) maxAge = parseInt(match[1], 10);
            }
            cachedCertificates = certs;
            cacheExpiresAt = Date.now() + maxAge * 1000;
            resolve(certs);
          } catch (e) {
            reject(new Error('Failed to parse Google public certificates: ' + e.message));
          }
        });
      })
      .on('error', (err) => {
        reject(new Error('Failed to fetch Google public certificates: ' + err.message));
      });
  });
};

/**
 * Direct cryptographic verification of Firebase ID Token against Google public certificates
 */
const verifyWithGoogleCertificates = async (idToken) => {
  // 1. Decode token header to get Key ID (kid)
  const decodedHeader = jwt.decode(idToken, { complete: true });
  if (!decodedHeader || !decodedHeader.header || !decodedHeader.header.kid) {
    throw new Error('Invalid Firebase ID Token format or missing Key ID');
  }

  const { kid, alg } = decodedHeader.header;
  if (alg !== 'RS256') {
    throw new Error(`Invalid token algorithm: expected RS256, got ${alg}`);
  }

  // 2. Fetch Google's public certificates
  const certs = await getGoogleCertificates();
  const cert = certs[kid];
  if (!cert) {
    throw new Error('Public key not found for the given Firebase ID Token Key ID');
  }

  // 3. Cryptographically verify signature, audience, issuer, and expiration
  const expectedIssuer = `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`;
  const verifiedPayload = jwt.verify(idToken, cert, {
    algorithms: ['RS256'],
    audience: FIREBASE_PROJECT_ID,
    issuer: expectedIssuer,
  });

  return verifiedPayload;
};

/**
 * Verify a Firebase ID Token server-side
 * Uses Firebase Admin SDK when available, with seamless cryptographic public key fallback
 *
 * @param {string} idToken - The Firebase ID Token received from frontend Google Sign-In
 * @returns {Promise<Object>} Decoded & cryptographically verified token payload
 */
const verifyFirebaseIdToken = async (idToken) => {
  if (!idToken || typeof idToken !== 'string') {
    throw new Error('Firebase ID Token must be a non-empty string');
  }

  // Attempt Firebase Admin SDK verification first
  if (firebaseAdminInitialized) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken, true);
      if (decodedToken) {
        return decodedToken;
      }
    } catch (adminErr) {
      // If error is invalid token / expired / revoked, propagate or check with direct cert verifier
      if (
        adminErr.code === 'auth/id-token-expired' ||
        adminErr.code === 'auth/id-token-revoked' ||
        adminErr.code === 'auth/argument-error'
      ) {
        throw new Error(adminErr.message);
      }
      // If admin SDK failed due to local credentials/gcp environment, fallback to public cert verifier
    }
  }

  // Direct Cryptographic Public Certificate Verification
  return await verifyWithGoogleCertificates(idToken);
};

module.exports = {
  verifyFirebaseIdToken,
  FIREBASE_PROJECT_ID,
};
