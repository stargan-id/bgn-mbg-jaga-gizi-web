import jwt from 'jsonwebtoken';
import fs from 'fs';

/**
 * Generate MapKit JS JWT Token
 * Reference: https://developer.apple.com/documentation/mapkitjs/creating_a_maps_identifier_and_a_signing_key
 */
export function generateMapKitJWT(): string {
  const teamId = process.env.MAPKIT_TEAM_ID;
  const keyId = process.env.MAPKIT_KEY_ID;
  const privateKeyPath = process.env.MAPKIT_PRIVATE_KEY_PATH;
  const privateKeyString = process.env.MAPKIT_PRIVATE_KEY;
  const origin = process.env.MAPKIT_ORIGIN || 'http://localhost:3000';

  if (!teamId || !keyId) {
    throw new Error('MAPKIT_TEAM_ID and MAPKIT_KEY_ID are required');
  }

  let privateKey: string;

  // Try to get private key from file path first, then from environment variable
  if (privateKeyPath && fs.existsSync(privateKeyPath)) {
    privateKey = fs.readFileSync(privateKeyPath, 'utf8');
  } else if (privateKeyString) {
    privateKey = privateKeyString.replace(/\\n/g, '\n');
  } else {
    throw new Error('MAPKIT_PRIVATE_KEY_PATH or MAPKIT_PRIVATE_KEY is required');
  }

  const now = Math.floor(Date.now() / 1000);
  const exp = now + (60 * 60 * 24 * 30); // 30 days expiration

  const payload = {
    iss: teamId,
    iat: now,
    exp: exp,
    origin: origin
  };

  const token = jwt.sign(payload, privateKey, {
    algorithm: 'ES256',
    keyid: keyId,
    header: {
      alg: 'ES256',
      kid: keyId,
      typ: 'JWT'
    }
  });

  return token;
}

/**
 * Get MapKit JWT token from environment or generate new one
 */
export function getMapKitJWT(): string {
  // First try to use pre-generated token from environment
  const existingToken = process.env.MAPKIT_JWT;
  
  if (existingToken && existingToken !== 'your_jwt_token_here') {
    try {
      // Verify token is not expired
      const decoded = jwt.decode(existingToken) as any;
      if (decoded && decoded.exp && decoded.exp > Math.floor(Date.now() / 1000)) {
        return existingToken;
      }
    } catch (error) {
      console.warn('Existing MAPKIT_JWT token is invalid, generating new one');
    }
  }

  // Generate new token if none exists or expired
  return generateMapKitJWT();
}

/**
 * Utility to print JWT token for manual configuration
 */
export function printMapKitJWT() {
  try {
    const token = generateMapKitJWT();
    console.log('Generated MapKit JWT Token:');
    console.log(token);
    console.log('\nAdd this to your .env.local file:');
    console.log(`MAPKIT_JWT="${token}"`);
    console.log(`NEXT_PUBLIC_MAPKIT_JS_TOKEN="${token}"`);
  } catch (error) {
    console.error('Error generating MapKit JWT:', error);
  }
}