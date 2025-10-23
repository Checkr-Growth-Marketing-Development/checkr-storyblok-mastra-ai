import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { StoryblokStoryOutputSchema } from '../../utils/types';
import storyblokClient from '../../utils/storyblok/client';
import getSpaceVersion from '../../utils/storyblok/getSpaceVersion';

export const getStoriesByTypeOrPathTool = createTool({
    id: "get-stories-by-type-or-path",
    description: "Tool for fetching stories from Storyblok based on content-type or path",
    inputSchema: z.object({
        type: z.array(z.string()).optional().describe("The content-type of the stories to fetch"),
        path: z.string().optional().describe("The full slug of the stories to fetch"),
        status: z.string().optional().describe("Weather to fetch draft of published stories (default: published)"),
        includeContent: z.boolean().optional().describe("Whether to include the content of the stories (default: false)"),
        limit: z.number().int().optional().describe("Maximum number of stories to return (default: 25, max: 1000)"),
    }),
    outputSchema: z.object({
        stories: z.array(StoryblokStoryOutputSchema),
    }),
    execute: async ({ context }, options) => {
        try {

            const stories = await getStoriesByTypeOrPath({ type: context.type, path: context.path, status: context.status, limit: context.limit });

            const storiesList = stories.map((story) => ({
                ...story,
                content_type: story.content?.component || story.content_type,
                content: context.includeContent ? story.content : undefined,
                updated_at: story.updated_at || story.created_at,
                is_folder: story.is_folder ?? false,
            }));

            return {
                stories: storiesList,
            }
        } catch (e) {
            console.error('Error fetching stories:', e);
            throw new Error('Error fetching stories');
        }

    },
})

const getStoriesByTypeOrPath = async ({ type, path, status, limit }: { type?: string[], path?: string, status?: string, limit?: number }) => {
    const maxLimit = limit || 100;
    const perPage = Math.min(maxLimit, 100);
    let currentPage = 1;
    let totalPages = 1;
    let allData: any[] = [];
    const version = await getSpaceVersion();

    while (currentPage <= totalPages && allData.length < maxLimit) {
        try {
            const params: any = {
                version: status || 'published',
                resolve_links: 'link',
                page: currentPage,
                per_page: perPage,
                cv: version,
                sort_by: "first_published_at:desc"
            }

            if (type && type.length > 0) {
                params['filter_query'] = {
                    component: {
                        in: type.toString()
                    }
                }
            }

            if (path && path.length > 0) {
                params['starts_with'] = path.replace(/^\/+/, '');
            }

            const response = await storyblokClient.get('cdn/stories', params);
            const { data, total } = response;

            totalPages = Math.ceil(Number(total) / perPage);
            const newStories = data.stories.slice(0, maxLimit - allData.length);
            allData = [...allData, ...newStories];

            if (allData.length >= maxLimit) break;

            currentPage++;
            await new Promise(resolve => setTimeout(resolve, 70));

        } catch (e) {
            console.error('Error fetching stories:', e);
            throw new Error('Error fetching stories');
        }
    }

    return allData;

}
