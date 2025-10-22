import { createTool } from '@mastra/core/tools';
import { z } from 'zod';


import storyblokClient from '../utils/storyblok/client';
import getSpaceVersion from '../utils/storyblok/getSpaceVersion';
import {StoryblokStoryOutputSchema} from "../utils/types";

const getStory = async ({ uuid, id, slug, storyVersion }: { uuid?: string ,id?: number, slug?: string, storyVersion?: string | 'draft' | 'published' }) => {
    const params: any = {
        version: storyVersion || 'published',
        resolve_links: 'link',
        cv: await getSpaceVersion(),
    }

    if (id) {
        params.id = id;
    } else if (slug) {
        params.full_slug = slug.replace(/^\/+/, '');
    } else if(uuid) {
        params.uuid = uuid;
    } else {
        throw new Error('Either id or slug must be provided');
    }

    const response = await storyblokClient.get(`cdn/stories/${uuid || id || slug}`, {});
    const { data } = response;

    return data.story;
}

export const getStoryTool = createTool({
    id: "get-story",
    description: "Tool for fetching a single story from Storyblok based on id or slug",
    inputSchema: z.object({
        id: z.number().optional().describe("The id of the story to fetch"),
        slug: z.string().optional().describe("The slug of the story to fetch"),
        version: z.string().optional().describe("Weather to fetch draft of published stories (default: published)"),
    }).refine(data => data.id !== undefined || data.slug !== undefined, {
        message: "Either id or slug must be provided",
    }),
    outputSchema: StoryblokStoryOutputSchema,
    execute: async ({ context }) => {
        try {
            const story = await getStory({ id: context.id, slug: context.slug, storyVersion: context.version });
            return story;
        } catch (e) {
            console.error('Error fetching story:', e);
            throw new Error('Error fetching story');
        }
    },
})
