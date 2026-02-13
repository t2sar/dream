// Ensure you have React App environment variables or replace this with your Client ID
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''; 
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata';

declare const google: any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let tokenClient: any;
let accessToken: string | null = null;

export const initGoogleDrive = (callback: (token: string) => void) => {
  if (typeof google === 'undefined') {
    console.error("Google script not loaded");
    return;
  }
  
  if (!CLIENT_ID) {
    console.warn("Google Client ID is missing. Backup will not work.");
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (tokenResponse: any) => {
      accessToken = tokenResponse.access_token;
      if (tokenResponse.error) {
          console.error(tokenResponse);
          throw new Error(tokenResponse.error);
      }
      callback(accessToken as string);
    },
  });
};

export const connectDrive = () => {
  if (tokenClient) {
    tokenClient.requestAccessToken();
  } else {
      console.error("Google Client not initialized. Check your Client ID.");
      alert("Google Drive integration requires a Client ID.");
  }
};

const driveFetch = async (url: string, options: RequestInit = {}) => {
    if (!accessToken) throw new Error("Not authenticated");
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        ...options.headers,
    };
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || "Drive API Error");
    }
    return res;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const backupToDrive = async (data: any) => {
    // 1. Search for existing backup file in AppData folder
    const searchParams = new URLSearchParams({
        q: "name='tanmoy_backup.json' and 'appDataFolder' in parents and trashed=false",
        spaces: 'appDataFolder',
        fields: 'files(id, name)'
    });
    
    const searchRes = await driveFetch(`https://www.googleapis.com/drive/v3/files?${searchParams}`);
    const searchData = await searchRes.json();
    
    const fileContent = JSON.stringify(data);
    const fileBlob = new Blob([fileContent], { type: 'application/json' });

    if (searchData.files && searchData.files.length > 0) {
        // Update existing file
        const fileId = searchData.files[0].id;
        // Simple upload for update (PATCH)
        await driveFetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: fileBlob
        });
        return "Backup updated successfully!";
    } else {
        // Create new file
        const metadata = {
            name: 'tanmoy_backup.json',
            parents: ['appDataFolder']
        };

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', fileBlob);

        await driveFetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            body: form
        });
        return "New backup created successfully!";
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const restoreFromDrive = async (): Promise<any> => {
    const searchParams = new URLSearchParams({
        q: "name='tanmoy_backup.json' and 'appDataFolder' in parents and trashed=false",
        spaces: 'appDataFolder',
        fields: 'files(id, name)'
    });
    const searchRes = await driveFetch(`https://www.googleapis.com/drive/v3/files?${searchParams}`);
    const searchData = await searchRes.json();

    if (!searchData.files || searchData.files.length === 0) {
        throw new Error("No backup found in your Google Drive.");
    }

    const fileId = searchData.files[0].id;
    const downloadRes = await driveFetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`);
    return await downloadRes.json();
};