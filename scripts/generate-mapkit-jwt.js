#!/usr/bin/env node

/**
 * Generate MapKit JS JWT Token Script
 * Run: node scripts/generate-mapkit-jwt.js
 */

const path = require('path');

// Load environment variables from both .env and .env.local
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const jwt = require('jsonwebtoken');
const fs = require('fs');

function generateMapKitJWT() {
  console.log('🔍 Checking MapKit configuration...\n');
  
  const teamId = process.env.MAPKIT_TEAM_ID;
  const keyId = process.env.MAPKIT_KEY_ID;
  const privateKeyPath = process.env.MAPKIT_PRIVATE_KEY_PATH;
  const privateKeyString = process.env.MAPKIT_PRIVATE_KEY;
  const origin = process.env.MAPKIT_ORIGIN || 'http://localhost:3000';

  console.log('Configuration found:');
  console.log(`- MAPKIT_TEAM_ID: ${teamId ? '✅ Set' : '❌ Missing'}`);
  console.log(`- MAPKIT_KEY_ID: ${keyId ? '✅ Set' : '❌ Missing'}`);
  console.log(`- MAPKIT_PRIVATE_KEY_PATH: ${privateKeyPath ? '✅ Set' : '❌ Missing'}`);
  console.log(`- MAPKIT_PRIVATE_KEY: ${privateKeyString && privateKeyString !== 'YOUR_PRIVATE_KEY_HERE' ? '✅ Set' : '❌ Missing'}`);
  console.log(`- MAPKIT_ORIGIN: ${origin}\n`);

  if (!teamId || !keyId) {
    console.error('❌ MAPKIT_TEAM_ID and MAPKIT_KEY_ID are required');
    console.log('\n📝 Please add these to your .env.local file:');
    console.log('MAPKIT_TEAM_ID="your_team_id_here"');
    console.log('MAPKIT_KEY_ID="your_key_id_here"');
    console.log('\n💡 Get these from Apple Developer Console:');
    console.log('https://developer.apple.com/account/resources/authkeys/list');
    process.exit(1);
  }

  let privateKey;

  // Try to get private key from file path first, then from environment variable
  if (privateKeyPath && fs.existsSync(privateKeyPath)) {
    privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    console.log('✅ Using private key from file:', privateKeyPath);
  } else if (privateKeyString && privateKeyString !== 'YOUR_PRIVATE_KEY_HERE') {
    privateKey = privateKeyString.replace(/\\n/g, '\n');
    console.log('✅ Using private key from environment variable');
  } else {
    console.error('❌ MAPKIT_PRIVATE_KEY_PATH or MAPKIT_PRIVATE_KEY is required');
    console.log('\n📝 Choose one of these options in your .env.local file:');
    console.log('\nOption 1 - File path:');
    console.log('MAPKIT_PRIVATE_KEY_PATH="./AuthKey_YOUR_KEY_ID.p8"');
    console.log('\nOption 2 - Direct key content:');
    console.log('MAPKIT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYOUR_KEY_CONTENT\\n-----END PRIVATE KEY-----"');
    console.log('\n💡 Download .p8 file from Apple Developer Console:');
    console.log('https://developer.apple.com/account/resources/authkeys/list');
    process.exit(1);
  }

  const now = Math.floor(Date.now() / 1000);
  const exp = now + (60 * 60 * 24 * 30); // 30 days expiration

  const payload = {
    iss: teamId,
    iat: now,
    exp: exp,
    origin: origin
  };

  try {
    const token = jwt.sign(payload, privateKey, {
      algorithm: 'ES256',
      keyid: keyId,
      header: {
        alg: 'ES256',
        kid: keyId,
        typ: 'JWT'
      }
    });

    console.log('\n🎉 MapKit JWT Token generated successfully!');
    console.log('\n📋 Token:');
    console.log(token);
    
    console.log('\n📝 Add these to your .env.local file:');
    console.log(`MAPKIT_JWT="${token}"`);
    console.log(`NEXT_PUBLIC_MAPKIT_JS_TOKEN="${token}"`);
    
    console.log('\n⏰ Token expires:', new Date(exp * 1000).toISOString());
    console.log('🌐 Valid for origin:', origin);
    
    return token;
  } catch (error) {
    console.error('❌ Error generating MapKit JWT:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  generateMapKitJWT();
}

module.exports = { generateMapKitJWT };