import { MCPServer } from "@mastra/mcp";
import {getStoriesByTypeOrPathTool} from "../tools/get-stories-by-type-or-path";
import {storyblokResources} from "../resources/storyblok-resources";
import {getStoryTool} from "../tools/get-story";



export const storyblokMcpServer = new MCPServer({
    id: "storyblok-mcp-server",
    name: "Storyblok Server",
    version: "1.0.0",
    description: "A Storyblok MCP Server for fetching content from Checkr's Storyblok space.",
    tools: {
        getStoriesByTypeOrPathTool,
        getStoryTool,
    },
    agents: {},
    workflows: {},
    resources: {
        ...storyblokResources,
    },
});
