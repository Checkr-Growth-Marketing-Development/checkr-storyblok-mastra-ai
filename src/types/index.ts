/**
 * Type definitions for Storyblok MCP Server
 */
import {z} from "zod";

export interface StoryblokStory {
    id: number;
    name: string;
    slug: string;
    full_slug: string;
    content: Record<string, any>;
    created_at: string;
    updated_at: string;
    published_at?: string;
    first_published_at?: string;
    is_startpage: boolean;
    parent_id?: number;
    group_id?: string;
    position: number;
    tag_list: string[];
    is_folder: boolean;
    content_type: string;
    uuid?: string;
    path?: string;
    component?: string;
}

export const StoryblokStoryOutputSchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    full_slug: z.string(),
    content: z.record(z.string(), z.any()).optional(),
    created_at: z.string(),
    updated_at: z.string().optional(),
    published_at: z.string().optional(),
    first_published_at: z.string().optional(),
    is_startpage: z.boolean(),
    parent_id: z.number().nullable().optional(),
    group_id: z.string().optional(),
    position: z.number(),
    tag_list: z.array(z.string()).optional(),
    is_folder: z.boolean().optional(),
    content_type: z.string(),
    uuid: z.string().optional(),
    path: z.string().nullable().optional(),
    component: z.string().optional(),
});
export interface StoryblokApiResponse<T> {
    story?: T;
    stories?: T[];
    cv?: number;
    rels?: any[];
    links?: any[];
}

export interface GetStoryArgs {
    identifier: string;
    version?: 'draft' | 'published';
}

export interface ListStoriesArgs {
    starts_with?: string;
    content_type?: string;
    per_page?: number;
    page?: number;
}

export interface SearchStoriesArgs {
    query: string;
    content_type?: string;
}

export interface StoryblokConfig {
    apiToken: string;
    baseUrl?: string;
    version?: 'draft' | 'published';
    cache?: boolean;
}

export interface McpToolResponse {
    content: Array<{
        type: 'text' | 'image' | 'resource';
        text?: string;
        data?: string;
        mimeType?: string;
    }>;
    isError?: boolean;
}
