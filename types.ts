export interface Submission {
	id: string;
	encryptedData: string; // Base64 encoded encrypted data
	iv: string; // Base64 encoded initialization vector
}

export interface EncryptedResult {
	encryptedData: string;
	iv: string;
}
