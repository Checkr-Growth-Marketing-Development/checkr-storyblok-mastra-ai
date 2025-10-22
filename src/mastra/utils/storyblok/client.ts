const BASE_URL = 'https://api-us.storyblok.com/v2';
const MANAGEMENT_URL = 'https://mapi.storyblok.com/v1';

const storyblokClient = {
    async get(path: string, params: any = {}) {
        const isManagementAPI = path.startsWith('spaces/');
        const baseUrl = isManagementAPI ? MANAGEMENT_URL : BASE_URL;
        const token = isManagementAPI 
            ? process.env.STORYBLOK_OAUTH_TOKEN 
            : process.env.STORYBLOK_PREVIEW_TOKEN;
        
        const url = new URL(`${baseUrl}/${path}`);
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (typeof value === 'object') {
                    url.searchParams.append(key, JSON.stringify(value));
                } else {
                    url.searchParams.append(key, String(value));
                }
            }
        });
        
        url.searchParams.append('token', token!);
        
        const response = await fetch(url.toString());
        
        if (!response.ok) {
            throw new Error(`Storyblok API error: ${response.statusText}`);
        }
        
        const json = await response.json();
        return {
            data: json,
            total: json.total || 0
        };
    }
};

export default storyblokClient;
