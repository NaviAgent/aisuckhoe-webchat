import getConfig from "next/config";
import canUseDOM from "./canUseDOM";

const { publicRuntimeConfig } = await getConfig()


export const getServerSideURL = () => {
  let url = publicRuntimeConfig.app.serverUrl;

  if (!url && publicRuntimeConfig.vercel.projectProductionUrl) {
    return `https://${publicRuntimeConfig.vercel.projectProductionUrl}`;
  }

  if (!url) {
    url = "http://localhost:3000";
  }

  return url;
};

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol;
    const domain = window.location.hostname;
    const port = window.location.port;

    return `${protocol}//${domain}${port ? `:${port}` : ""}`;
  }

  if (publicRuntimeConfig.vercel.projectProductionUrl) {
    return `https://${publicRuntimeConfig.vercel.projectProductionUrl}`;
  }

  return publicRuntimeConfig.app.serverUrl || "";
};
