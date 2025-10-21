import StoryblokClient from "storyblok-js-client";


const storyblokClient = new StoryblokClient({
    accessToken: process.env.STORYBLOK_PREVIEW_TOKEN,
    oauthToken: process.env.STORYBLOK_OAUTH_TOKEN,
    region: 'us',
    cache: {
        clear: 'auto',
        type: 'memory'
    }
});

export default storyblokClient;
