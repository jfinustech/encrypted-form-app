import React, { useState } from 'react';
import type { Submission } from '../types';
import { decryptData, importKey } from '../services/cryptoService';

interface DecryptedContent {
	name: string;
	message: string;
	signature?: string;
	submittedAt: string;
}

interface SubmissionCardProps {
	submission: Submission;
}

const SubmissionCard: React.FC<SubmissionCardProps> = ({ submission }) => {
	const [isDecrypting, setIsDecrypting] = useState(false);
	const [decryptionKey, setDecryptionKey] = useState('');
	const [decryptedContent, setDecryptedContent] =
		useState<DecryptedContent | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleDecrypt = async () => {
		if (!decryptionKey) {
			setError('Please enter a decryption key.');
			return;
		}
		setIsDecrypting(true);
		setError(null);
		setDecryptedContent(null);
		try {
			const key = await importKey(decryptionKey);
			const decrypted = await decryptData(
				submission.encryptedData,
				submission.iv,
				key,
			);
			const parsedContent = JSON.parse(decrypted);
			setDecryptedContent(parsedContent);
		} catch (err) {
			setError('Decryption failed. The key is likely incorrect.');
			console.error('Decryption error:', err);
		} finally {
			setIsDecrypting(false);
		}
	};

	return (
		<div className="bg-card p-4 rounded-lg shadow-md space-y-3">
			<p className="text-sm text-text-secondary truncate">
				<span className="font-semibold text-text-primary">ID:</span>{' '}
				{submission.id}
			</p>
			<p className="text-sm text-text-secondary truncate">
				<span className="font-semibold text-text-primary">IV:</span>{' '}
				{submission.iv}
			</p>
			<p className="text-sm text-text-secondary">
				<span className="font-semibold text-text-primary">
					Encrypted Data:
				</span>
				<textarea
					defaultValue={submission.encryptedData}
					className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
				/>
			</p>
			<div className="flex flex-col sm:flex-row gap-2">
				<input
					type="password"
					placeholder="Enter decryption key"
					defaultValue={decryptionKey}
					onChange={(e) => setDecryptionKey(e.target.value)}
					className="flex-grow w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
					aria-label={`Decryption key for submission ${submission.id}`}
				/>
				<button
					onClick={handleDecrypt}
					disabled={isDecrypting}
					className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:bg-emerald-300 disabled:cursor-not-allowed"
				>
					{isDecrypting ? 'Decrypting...' : 'Decrypt'}
				</button>
			</div>
			{error && <p className="text-sm text-red-600">{error}</p>}
			{decryptedContent && (
				<div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200 space-y-4">
					<h4 className="font-semibold text-text-primary">
						Decrypted Content:
					</h4>
					<div>
						<p className="text-sm font-medium text-gray-500">
							Name
						</p>
						<p className="text-base text-text-primary whitespace-pre-wrap font-sans bg-white p-2 border rounded-md">
							{decryptedContent.name}
						</p>
					</div>
					<div>
						<p className="text-sm font-medium text-gray-500">
							Message
						</p>
						<pre className="text-base text-text-primary whitespace-pre-wrap font-sans bg-white p-2 border rounded-md">
							{decryptedContent.message}
						</pre>
					</div>
					{decryptedContent.signature && (
						<div>
							<p className="text-sm font-medium text-gray-500">
								Signature
							</p>
							<div className="text-base text-text-primary whitespace-pre-wrap font-sans bg-white p-2 border rounded-md">
								<img
									src={decryptedContent.signature}
									alt="Digital signature"
									className="max-w-full h-auto"
								/>
							</div>
						</div>
					)}
					<div>
						<p className="text-sm font-medium text-gray-500">
							Submitted At
						</p>
						<p className="text-sm text-text-primary mt-2">
							{new Date(
								decryptedContent.submittedAt,
							).toLocaleString()}
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

interface SubmissionsListProps {
	submissions: Submission[];
}

export const SubmissionsList: React.FC<SubmissionsListProps> = ({
	submissions,
}) => {
	return (
		<div className="space-y-4">
			{submissions.length === 0 ? (
				<div className="text-center py-10 px-4 bg-card rounded-lg shadow-md">
					<p className="text-text-secondary">No submissions yet</p>
				</div>
			) : (
				[...submissions]
					.reverse()
					.map((submission) => (
						<SubmissionCard
							key={submission.id}
							submission={submission}
						/>
					))
			)}
		</div>
	);
};
