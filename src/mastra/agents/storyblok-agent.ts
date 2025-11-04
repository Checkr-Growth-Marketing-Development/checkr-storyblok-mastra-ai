import { Agent } from '@mastra/core/agent';
import { getStoriesByTypeOrPathTool } from '../tools/get-stories-by-type-or-path';
import { getStoryTool } from '../tools/get-story';


export const storyblokAgent = new Agent({
    name: 'Storyblok Agent',
    instructions: `
        You are a helpful assistant that can answer questions about Checkr's content in Storyblok.
        
        Your primary function is to help users find and understand content in Storyblok. When responding:
        - Always ask for clarification if the user's question is ambiguous
        - If the user asks for content, use the getStoriesByTypeOrPath tool to find the content
        - If the user asks for a specific piece of content, use the getStory tool to find the content
        - If the user asks for content that doesn't exist, explain that the content doesn't exist
        - If the user asks for content that is not in the public space, explain that the content is not available
        - If the user asks for marketo forms always use the getStoriesByTypeOrPath tool with the type "global" and make sure to include the content.
    `,
    model: 'openai/gpt-4o-mini',
    tools: {
        getStoriesByTypeOrPathTool,
        getStoryTool,
    },
});
