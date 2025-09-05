import React, { useState } from 'react';

interface KeyModalProps {
	isOpen: boolean;
	onClose: () => void;
	decryptionKey: string | null;
}

const CopyIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-5 w-5"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
		/>
	</svg>
);

export const KeyModal: React.FC<KeyModalProps> = ({
	isOpen,
	onClose,
	decryptionKey,
}) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		if (decryptionKey) {
			navigator.clipboard.writeText(decryptionKey);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
			<div className="bg-card rounded-lg shadow-2xl p-6 w-full max-w-md mx-auto">
				<h2 className="text-xl font-bold text-gray-800">
					Submission Successful!
				</h2>
				<p className="mt-2 text-text-secondary">Decryption key:</p>
				<div className="mt-4 bg-gray-100 p-3 rounded-md flex items-center justify-between gap-2">
					<code className="text-sm text-gray-700 break-all">
						{decryptionKey}
					</code>
					<button
						onClick={handleCopy}
						className="p-2 text-gray-500 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
					>
						{copied ? 'Copied!' : <CopyIcon />}
					</button>
				</div>
				<div className="mt-6 text-right">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
					>
						I have saved my key
					</button>
				</div>
			</div>
		</div>
	);
};
