import React, { useState } from 'react';
import { SignatureCanvas } from './SignatureCanvas';

interface SubmissionFormProps {
  onSubmit: (name: string, message: string, signature: string | null) => Promise<void>;
}

export const SubmissionForm: React.FC<SubmissionFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [signature, setSignature] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !message || !password || !signature) {
      setError('Please fill out all fields including signature.');
      return;
    }

    const storedPassword = localStorage.getItem('app-password');
    if (password !== storedPassword) {
      setError('Incorrect password. Please try again.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(name, message, signature);
      setName('');
      setMessage('');
      setPassword('');
      setSignature(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-primary">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Jane Doe"
            disabled={isSubmitting}
            aria-required="true"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-text-primary">
            Secure Message
          </label>
          <textarea
            id="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Enter your secret message here..."
            disabled={isSubmitting}
            aria-required="true"
          />
        </div>
        <SignatureCanvas 
          onSignatureChange={setSignature}
          disabled={isSubmitting}
        />
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-primary">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Enter the submission password"
            disabled={isSubmitting}
            aria-required="true"
          />
        </div>
        
        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-indigo-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Encrypting...' : 'Encrypt & Submit'}
        </button>
      </form>
    </div>
  );
};