import { logger } from '@/lib/logger';

const XAI_MANAGEMENT_API = 'https://management-api.x.ai/v1';
const XAI_API = 'https://api.x.ai/v1';

function getManagementApiKey(): string {
  const key = process.env.XAI_MANAGEMENT_API_KEY || process.env.XAI_API_KEY;
  if (!key) throw new Error('xAI API key not configured for Collections');
  return key;
}

function getApiKey(): string {
  if (!process.env.XAI_API_KEY) throw new Error('XAI_API_KEY not configured');
  return process.env.XAI_API_KEY;
}

// --- Types ---

export interface CollectionInfo {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

export interface FileInfo {
  id: string;
  filename: string;
  bytes?: number;
  created_at?: string;
}

export interface SearchResult {
  content: string;
  score: number;
  document_id?: string;
  metadata?: Record<string, unknown>;
}

// --- Collection Management (Management API) ---

export async function createCollection(
  name: string,
  description?: string
): Promise<{ collection_id: string }> {
  const apiKey = getManagementApiKey();

  const response = await fetch(`${XAI_MANAGEMENT_API}/collections`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description }),
  });

  if (!response.ok) {
    const error = await response.text();
    logger.error('xAI create collection failed', { status: response.status, error });
    throw new Error(`Failed to create collection: ${response.status}`);
  }

  const data = await response.json();
  return { collection_id: data.id || data.collection_id };
}

export async function deleteCollection(collectionId: string): Promise<void> {
  const apiKey = getManagementApiKey();

  const response = await fetch(`${XAI_MANAGEMENT_API}/collections/${collectionId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${apiKey}` },
  });

  if (!response.ok) {
    const error = await response.text();
    logger.error('xAI delete collection failed', { status: response.status, error });
    throw new Error(`Failed to delete collection: ${response.status}`);
  }
}

export async function getCollection(collectionId: string): Promise<CollectionInfo> {
  const apiKey = getManagementApiKey();

  const response = await fetch(`${XAI_MANAGEMENT_API}/collections/${collectionId}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${apiKey}` },
  });

  if (!response.ok) {
    const error = await response.text();
    logger.error('xAI get collection failed', { status: response.status, error });
    throw new Error(`Failed to get collection: ${response.status}`);
  }

  return response.json();
}

// --- File Operations (Standard API) ---

export async function uploadFileToCollection(
  collectionId: string,
  content: string | Buffer,
  filename: string,
  mimeType: string = 'text/plain'
): Promise<{ file_id: string }> {
  const apiKey = getApiKey();

  // Step 1: Upload the file
  const blobContent = typeof content === 'string'
    ? content
    : new Uint8Array(content);
  const blob = new Blob([blobContent], { type: mimeType });

  const formData = new FormData();
  formData.append('file', blob, filename);
  formData.append('purpose', 'assistants');

  const uploadResponse = await fetch(`${XAI_API}/files`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}` },
    body: formData,
  });

  if (!uploadResponse.ok) {
    const error = await uploadResponse.text();
    logger.error('xAI file upload failed', { status: uploadResponse.status, error });
    throw new Error(`Failed to upload file: ${uploadResponse.status}`);
  }

  const fileData = await uploadResponse.json();
  const fileId = fileData.id;

  // Step 2: Add file to collection
  const mgmtKey = getManagementApiKey();
  const addResponse = await fetch(
    `${XAI_MANAGEMENT_API}/collections/${collectionId}/documents`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mgmtKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file_id: fileId }),
    }
  );

  if (!addResponse.ok) {
    const error = await addResponse.text();
    logger.error('xAI add file to collection failed', { status: addResponse.status, error, fileId });
    throw new Error(`Failed to add file to collection: ${addResponse.status}`);
  }

  return { file_id: fileId };
}

export async function deleteFileFromCollection(
  collectionId: string,
  fileId: string
): Promise<void> {
  const mgmtKey = getManagementApiKey();

  // Remove from collection
  const removeResponse = await fetch(
    `${XAI_MANAGEMENT_API}/collections/${collectionId}/documents/${fileId}`,
    {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${mgmtKey}` },
    }
  );

  if (!removeResponse.ok) {
    const error = await removeResponse.text();
    logger.error('xAI remove file from collection failed', { status: removeResponse.status, error });
  }

  // Also delete the file itself
  const apiKey = getApiKey();
  const deleteResponse = await fetch(`${XAI_API}/files/${fileId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${apiKey}` },
  });

  if (!deleteResponse.ok) {
    const error = await deleteResponse.text();
    logger.error('xAI delete file failed', { status: deleteResponse.status, error });
  }
}

// --- Search (Standard API) ---

export async function searchCollection(
  collectionId: string,
  query: string,
  options: { mode?: 'keyword' | 'semantic' | 'hybrid'; limit?: number } = {}
): Promise<SearchResult[]> {
  const apiKey = getApiKey();
  const { mode = 'hybrid', limit = 10 } = options;

  const response = await fetch(`${XAI_API}/documents/search`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      collection_id: collectionId,
      query,
      mode,
      top_k: limit,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    logger.error('xAI collection search failed', { status: response.status, error });
    throw new Error(`Collection search failed: ${response.status}`);
  }

  const data = await response.json();
  return (data.results || data.documents || []) as SearchResult[];
}
