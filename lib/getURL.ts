import canUseDOM from "./canUseDOM";
import { clientEnv } from "./env";

export const getServerSideURL = () => {
  let url = clientEnv?.NEXT_PUBLIC_SERVER_URL;

  if (!url && clientEnv?.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${clientEnv.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;
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

  if (clientEnv?.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${clientEnv.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  return clientEnv?.NEXT_PUBLIC_SERVER_URL || "";
};
