import type { MCPServerResources, MCPServerResourceContent, Resource, ResourceTemplate } from '@mastra/mcp';
import storyblokClient from '../../utils/storyblok/client';
import getSpaceVersion from '../../utils/storyblok/getSpaceVersion';

/**
 * Storyblok MCP Resources
 *
 * Provides access to Storyblok content through MCP resources:
 * - List all stories
 * - Get individual story content
 * - List content types/components
 * - Access stories by content type
 */

/**
 * List all available Storyblok resources
 */
async function listResources(): Promise<Resource[]> {
    const resources: Resource[] = [];

    try {
        // Add a resource for listing all stories
        resources.push({
            uri: 'storyblok://stories',
            name: 'All Storyblok Stories',
            description: 'List of all stories in the Storyblok space',
            mimeType: 'application/json',
        });

        // Add a resource for content types
        resources.push({
            uri: 'storyblok://content-types',
            name: 'Storyblok Content Types',
            description: 'List of all content types available in the Storyblok space',
            mimeType: 'application/json',
        });

        // Add a resource for listing all folders
        resources.push({
            uri: 'storyblok://folders',
            name: 'Storyblok Folders',
            description: 'List of all folders in the Storyblok space',
            mimeType: 'application/json',
        });

    } catch (error) {
        console.error('Error listing Storyblok resources:', error);
    }

    return resources;
}

/**
 * Get content for a specific resource URI
 */
async function getResourceContent({ uri }: { uri: string }): Promise<MCPServerResourceContent> {
    try {
        const path = uri.replace('storyblok://', '/');

        // Handle different resource types
        if (path === '/stories') {
            return await getAllStoriesContent();
        } else if (path === '/content-types') {
            return await getContentTypesContent();
        } else if (path === '/folders') {
            return await getFoldersContent();
        }

        return {
            text: JSON.stringify({
                error: 'Resource not found',
                uri,
            }, null, 2),
        };
    } catch (error) {
        console.error('Error getting resource content:', error);
        return {
            text: JSON.stringify({
                error: 'Failed to retrieve resource',
                message: error instanceof Error ? error.message : 'Unknown error',
            }, null, 2),
        };
    }
}

/**
 * Get all stories content
 */
async function getAllStoriesContent(): Promise<MCPServerResourceContent> {
    const perPage = 100;
    let currentPage = 1;
    let totalPages = 1;
    let allStories: any[] = [];
    const version = await getSpaceVersion();

    while (currentPage <= totalPages) {
        const response = await storyblokClient.get('cdn/stories', {
            version: 'published',
            page: currentPage,
            per_page: perPage,
            cv: version,
        });

        const { data, total } = response;
        totalPages = Math.ceil(Number(total) / perPage);
        allStories = [...allStories, ...data.stories];
        currentPage++;

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 70));
    }

    const storiesSummary = allStories.map(story => ({
        id: story.id,
        name: story.name,
        slug: story.slug,
        full_slug: story.full_slug,
        content_type: story.content?.component || 'unknown',
        published_at: story.published_at,
        created_at: story.created_at,
        updated_at: story.updated_at,
        is_startpage: story.is_startpage,
        parent_id: story.parent_id,
        uri: `storyblok://story/${story.id}`,
    }));

    return {
        text: JSON.stringify({
            total: allStories.length,
            stories: storiesSummary,
        }, null, 2),
    };
}

/**
 * Get content types/components
 */
async function getContentTypesContent(): Promise<MCPServerResourceContent> {
    const perPage = 100;
    let currentPage = 1;
    let totalPages = 1;
    let allStories: any[] = [];
    const version = await getSpaceVersion();

    while (currentPage <= totalPages) {
        const response = await storyblokClient.get('spaces/1014904/components/', {
            page: currentPage,
            per_page: perPage,
            cv: version,
        })


        const { data, total } = response;
        totalPages = Math.ceil(Number(total) / perPage);
        allStories = [...allStories, ...data.components];
        currentPage++;

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 10));
    }

    const contentType = allStories.filter(story => story.is_root === true).map(story => ({
        id: story.id,
        name: story.name,
        display_name: story.display_name,
        created_at: story.created_at,
        is_root: story.is_root,
        is_nestable: story.is_nestable,
    }));

    return {
        text: JSON.stringify({
            total_types: contentType.length,
            content_types: contentType,
        }, null, 2),
    };
}

/**
 * Get all folders
 */

async function getFoldersContent(): Promise<MCPServerResourceContent> {
    const perPage = 100;
    let currentPage = 1;
    let totalPages = 1;
    let allStories: any[] = [];
    const version = await getSpaceVersion();

    while (currentPage <= totalPages) {
        const response = await storyblokClient.get('spaces/1014904/stories/', {
            folder_only: true,
            page: currentPage,
            per_page: perPage,
            cv: version,
        })

        const { data, total } = response;
        totalPages = Math.ceil(Number(total) / perPage);
        allStories = [...allStories, ...data.stories];
        currentPage++;

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 10));
    }

    const folders = allStories.map(story => ({
        id: story.id,
        name: story.name,
        slug: story.slug,
        full_slug: story.full_slug,
        created_at: story.created_at,
        updated_at: story.updated_at,
        published_at: story.published_at,
        is_startpage: story.is_startpage,
        parent_id: story.parent_id,
        uri: `storyblok://story/${story.id}`,
    }

    ));

    return {
        text: JSON.stringify({
            total: allStories.length,
            folders: folders,
        }, null, 2),
    };
}


/**
 * Export the complete resource configuration for the MCP server
 */
export const storyblokResources: MCPServerResources = {
    listResources: async ({ extra }) => {
        return await listResources();
    },
    getResourceContent: async ({ uri, extra }) => {
        return await getResourceContent({ uri });
    },
};

