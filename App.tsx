import React, { useState, useCallback } from 'react';
import { SubmissionForm } from './components/SubmissionForm';
import { SubmissionsList } from './components/SubmissionsList';
import { Header } from './components/Header';
import { KeyModal } from './components/KeyModal';
import { PasswordSetup } from './components/PasswordSetup';
import { useLocalStorage } from './hooks/useLocalStorage';
import { encryptData, generateKey, exportKey } from './services/cryptoService';
import type { Submission, EncryptedResult } from './types';

const App: React.FC = () => {
  const [submissions, setSubmissions] = useLocalStorage<Submission[]>('submissions', []);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [passwordIsSet, setPasswordIsSet] = useState<boolean>(() => !!localStorage.getItem('app-password'));

  const handleFormSubmit = useCallback(async (name: string, message: string, signature: string | null) => {
    try {
      const key = await generateKey();
      const exportedKey = await exportKey(key);
      
      const dataToEncrypt = JSON.stringify({ name, message, signature, submittedAt: new Date().toISOString() });
      const encryptedResult: EncryptedResult = await encryptData(dataToEncrypt, key);
      
      const newSubmission: Submission = {
        id: crypto.randomUUID(),
        encryptedData: encryptedResult.encryptedData,
        iv: encryptedResult.iv,
      };

      setSubmissions(prev => [...prev, newSubmission]);
      setGeneratedKey(exportedKey);
      setIsKeyModalOpen(true);
    } catch (error) {
      console.error('Encryption failed:', error);
      alert('An error occurred during encryption. Please try again.');
    }
  }, [setSubmissions]);

  const handleCloseModal = () => {
    setIsKeyModalOpen(false);
    setGeneratedKey(null);
  };
  
  if (!passwordIsSet) {
    return <PasswordSetup onPasswordSet={() => setPasswordIsSet(true)} />;
  }

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Submit a Secure Message</h2>
            <p className="text-text-secondary mb-6">
              Your message will be end-to-end encrypted in your browser before being stored. Only the person with the generated decryption key can view the content.
            </p>
            <SubmissionForm onSubmit={handleFormSubmit} />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Review Encrypted Submissions</h2>
             <p className="text-text-secondary mb-6">
              Enter the unique decryption key for a submission to view its content. The key is never stored.
            </p>
            <SubmissionsList submissions={submissions} />
          </div>
        </div>
      </main>
      <KeyModal 
        isOpen={isKeyModalOpen} 
        onClose={handleCloseModal} 
        decryptionKey={generatedKey} 
      />
    </div>
  );
};

export default App;