"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function FirebaseTest() {
  const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const testFirebase = async () => {
      try {
        // Test write
        const testDoc = doc(db, 'test', 'connection');
        await setDoc(testDoc, { 
          timestamp: new Date(),
          message: 'Firebase connection test'
        });

        // Test read
        const docSnap = await getDoc(testDoc);
        
        if (docSnap.exists()) {
          setStatus('success');
          setMessage('✅ Firebase connected successfully!');
        } else {
          setStatus('error');
          setMessage('❌ Document write failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage(`❌ Firebase error: ${error}`);
        console.error('Firebase test error:', error);
      }
    };

    testFirebase();
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h3 className="font-bold mb-2">🔥 Firebase Test</h3>
      <div className={`text-sm ${
        status === 'success' ? 'text-green-600' : 
        status === 'error' ? 'text-red-600' : 
        'text-yellow-600'
      }`}>
        {status === 'testing' ? '🔄 Testing connection...' : message}
      </div>
      {status === 'success' && (
        <div className="text-xs text-gray-500 mt-2">
          Project: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}
        </div>
      )}
    </div>
  );
}