import { MCPServer } from "@mastra/mcp";
import {getStoriesByTypeOrPathTool} from "../tools/get-stories-by-type-or-path";


export const storyblokMcpServer = new MCPServer({
    id: "storyblok-mcp-server",
    name: "Storyblok Server",
    version: "1.0.0",
    tools: { getStoriesByTypeOrPathTool },
});
