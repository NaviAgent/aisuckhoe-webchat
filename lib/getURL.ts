import canUseDOM from "./canUseDOM";
import { clientEnv } from "./env";

export const getServerSideURL = () => {
  let url = clientEnv.app.serverUrl;

  if (!url && clientEnv.vercel.projectProductionUrl) {
    return `https://${clientEnv.vercel.projectProductionUrl}`;
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

  if (clientEnv.vercel.projectProductionUrl) {
    return `https://${clientEnv.vercel.projectProductionUrl}`;
  }

  return clientEnv.app.serverUrl || "";
};
