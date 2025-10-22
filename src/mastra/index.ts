import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import {storyblokMcpServer} from "./mcp/storyblok-mcp-server";
import {NetlifyDeployer} from "@mastra/deployer-netlify";

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
    deployer: new NetlifyDeployer(),
    bundler: {
        externals: ['storyblok-js-client', '@mastra/deployer-netlify'],
    }
});
