import React, { useState } from 'react';

interface PasswordSetupProps {
  onPasswordSet: () => void;
}

export const PasswordSetup: React.FC<PasswordSetupProps> = ({ onPasswordSet }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }
    try {
      localStorage.setItem('app-password', password);
      onPasswordSet();
    } catch (err) {
      setError('Could not save password. Please ensure localStorage is enabled.');
      console.error('Failed to set password:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex justify-center items-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-sm mx-auto">
        <h2 className="text-xl font-bold text-gray-800">Set a Password</h2>
        <form onSubmit={handleSetPassword} className="mt-4 space-y-4">
          <div>
            <input
              type="password"
              id="password-setup"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Enter a new password"
              aria-required="true"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Save Password
          </button>
        </form>
      </div>
    </div>
  );
};