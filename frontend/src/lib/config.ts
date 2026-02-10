const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        console.log("Config Debug: current hostname is", hostname);

        // If we are on your live domain, ALWAYS use /api
        if (hostname.includes('generexcom.com')) {
            console.log("Config: Matches live domain, using /api");
            return '/api';
        }
    }

    // Default to localhost for development
    return 'http://localhost:3001';
};

export const API_BASE_URL = getBaseUrl();

export const normalizeImageUrl = (path: string | null | undefined): string => {
    if (!path) return '';

    // If it's already a full URL that is NOT our legacy localhost, return as is
    if (path.startsWith('http') && !path.includes('localhost:3001')) {
        return path;
    }

    // Handle legacy localhost URLs or relative paths
    let relativePath = path;
    if (path.includes('localhost:3001')) {
        const index = path.indexOf('/uploads/');
        if (index !== -1) {
            relativePath = path.substring(index);
        }
    }

    // IDEMPOTENCY CHECK: If it already starts with API_BASE_URL, return it
    if (relativePath.startsWith(API_BASE_URL)) {
        return relativePath;
    }

    // If it doesn't start with /uploads or /, it's a filename or needs prefixing
    if (!relativePath.startsWith('/') && !relativePath.startsWith('http')) {
        relativePath = `/uploads/${relativePath}`;
    }

    // Prepend API_BASE_URL if it's relative
    if (relativePath.startsWith('/')) {
        const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
        // Final idempotency check for '/' prefix
        if (relativePath.startsWith(baseUrl + '/') && baseUrl !== '') return relativePath;
        return `${baseUrl}${relativePath}`;
    }

    return relativePath;
};

export const getApiUrl = (path: string) => {
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${API_BASE_URL}/${cleanPath}`;
};
