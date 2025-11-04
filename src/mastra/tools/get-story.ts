import {createTool} from '@mastra/core/tools';
import {z} from 'zod';

import storyblokClient from '../../utils/storyblok/client';
import getSpaceVersion from '../../utils/storyblok/getSpaceVersion';
import {StoryblokStoryOutputSchema} from "../../utils/types";

const getStory = async ({ uuid, id, slug, storyVersion }: { uuid?: string ,id?: number, slug?: string, storyVersion?: string | 'draft' | 'published' }) => {
    const params: any = {
        version: storyVersion || 'published',
        resolve_links: 'link',
        cv: await getSpaceVersion(),
    }

    let endpoint = 'cdn/stories';

    if (id) {
        endpoint = `cdn/stories/${id}`;
    } else if (slug) {
        // Remove leading slashes and ensure proper slug format
        const cleanSlug = slug.replace(/^\/+/, '');
        endpoint = `cdn/stories/${cleanSlug}`;
    } else if(uuid) {
        endpoint = `cdn/stories/${uuid}`;
    } else {
        throw new Error('Either id, slug, or uuid must be provided');
    }

    const response = await storyblokClient.get(endpoint, params);

    const story = response.data?.story;
    if (!story) {
        throw new Error(`Story not found for ${slug || id || uuid}`);
    }

    return {
        ...story,
        content_type: story.content?.component || 'page',
        updated_at: story.updated_at || story.created_at,
        is_folder: story.is_folder ?? false,
    };
}

export const getStoryTool = createTool({
    id: "get-story",
    description: "Tool for fetching a single story from Storyblok based on id or slug",
    inputSchema: z.object({
        id: z.number().int().optional().describe("The id of the story to fetch"),
        uuid: z.string().optional().describe("The uuid of the story to fetch"),
        slug: z.string().optional().describe("The slug of the story to fetch"),
        url: z.string().optional().describe("The url of the story to fetch"),
        version: z.string().optional().describe("Weather to fetch draft of published stories (default: published)"),
    }).refine(data => data.id !== undefined || data.slug !== undefined || data.url !== undefined, {
        message: "Either id, slug or url must be provided",
    }),
    outputSchema: StoryblokStoryOutputSchema,
    execute: async ({ context }) => {
        try {
            let slug = context.slug;
            if (context.url && !slug) {
                try {
                    const url = new URL(context.url);
                    slug = url.pathname;
                } catch (e) {
                    throw new Error('Invalid URL provided');
                }
            }

            return await getStory({id: context.id, slug: slug, storyVersion: context.version});
        } catch (e) {
            console.error('Error fetching story:', e);
            throw new Error('Error fetching story');
        }
    },
})
