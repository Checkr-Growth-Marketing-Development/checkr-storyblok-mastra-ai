import { Mastra } from '@mastra/core/mastra';
// import { PinoLogger } from '@mastra/loggers';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import { toolCallAppropriatenessScorer, completenessScorer, translationScorer } from './scorers/weather-scorer';
import { storyblokMcpServer } from "./mcp/storyblok-mcp-server";
import {storyblokAgent} from "./agents/storyblok-agent";
import {NetlifyDeployer} from "@mastra/deployer-netlify";

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent, storyblokAgent },
  scorers: { toolCallAppropriatenessScorer, completenessScorer, translationScorer },
  // logger: new PinoLogger({
  //   name: 'Mastra',
  //   level: 'info',
  // }),
  telemetry: {
    // Telemetry is deprecated and will be removed in the Nov 4th release
    enabled: false,
  },
  observability: {
    // Enables DefaultExporter and CloudExporter for AI tracing
    default: { enabled: true },
  },
    mcpServers: {
        storyblokMcpServer
    },
    deployer: new NetlifyDeployer(),
});
