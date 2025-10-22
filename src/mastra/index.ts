import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import { NetlifyDeployer } from "@mastra/deployer-netlify";
import {storyblokMcpServer} from "./mcp/storyblok-mcp-server";

export const mastra = new Mastra({
    workflows: { weatherWorkflow },
    agents: { weatherAgent },
    logger: new PinoLogger({
        name: 'Mastra',
        level: 'info',
    }),
    observability: {
        default: { enabled: true },
    },
    mcpServers: {
        server: storyblokMcpServer,
    },
    bundler: {
        externals: ["storyblok-js-client", "@modelcontextprotocol/sdk"],
    },
    deployer: new NetlifyDeployer(),
});
