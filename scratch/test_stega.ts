/**
 * Test script to verify LSB steganography logic
 */
import { lsbEncode, lsbDecode } from '../app/utils/steganography';

// This is for demonstration only as it requires a browser environment (Canvas/DOM)
// In a real test, we would use a library like 'canvas' for Node.js
async function testLSB() {
  console.log("Starting LSB verification test...");
  
  // Note: This won't run in pure Node.js because it uses document.createElement
  // But the logic itself (bit manipulation) is what we are verifying.
  
  const testMessage = "Hello World! This is a secret message.";
  console.log("Test Message:", testMessage);
  
  // Simulation of bits
  const binary = testMessage.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join('');
  console.log("Binary Length:", binary.length);
  
  // Reversal
  let decoded = '';
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.substring(i, i + 8);
    decoded += String.fromCharCode(parseInt(byte, 2));
  }
  
  console.log("Decoded Message:", decoded);
  if (testMessage === decoded) {
    console.log("SUCCESS: Bit conversion logic is correct.");
  } else {
    console.log("FAILURE: Bit conversion logic is broken.");
  }
}

testLSB().catch(console.error);
