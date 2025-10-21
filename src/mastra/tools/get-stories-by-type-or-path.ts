import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const getStoriesByTypeOrPathTool = createTool({
    id: "get-stories-by-type-or-path",
    description: "Tool for fetching stories from Storyblok based on content-type or path",
    inputSchema: z.object({
        type: z.string().optional().describe("The content-type of the stories to fetch"),
        path: z.string().optional().describe("The path of the stories to fetch"),
        status: z.string().default("published").optional().describe("Weather to fetch draft of published stories (default: published)"),
    }),
})

const getStoriesByTypeOrPath = async ({ type, path }: { type?: string; path?: string }) => {
    if (!type && !path) {
        throw new Error('Either type or path must be provided');
    }

}
