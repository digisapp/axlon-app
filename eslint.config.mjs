import nextConfig from "eslint-config-next/core-web-vitals";
import tsConfig from "eslint-config-next/typescript";

const eslintConfig = [
  {
    // One-off operational scraper/maintenance scripts run with node/tsx —
    // not part of the app build, not held to app lint standards
    ignores: ["scripts/**"],
  },
  ...nextConfig,
  ...tsConfig,
];

export default eslintConfig;
