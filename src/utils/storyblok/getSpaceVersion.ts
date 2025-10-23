import storyblokClient from "./client";

export default async function getSpaceVersion() {
    const { data } = await storyblokClient.get(`cdn/spaces/me`, {});
    return data.space.version;
}
