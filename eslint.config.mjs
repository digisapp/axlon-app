import nextConfig from "eslint-config-next/core-web-vitals";
import tsConfig from "eslint-config-next/typescript";

const eslintConfig = [
  {
    // One-off operational scraper/maintenance scripts run with node/tsx —
    // not part of the app build, not held to app lint standards
    ignores: [
      "scripts/**",
      // HEAVY HAUL RUSH is a prebuilt Vite/Three.js bundle served as static
      // files from /play — minified output, not source we lint
      "public/play/**",
    ],
  },
  ...nextConfig,
  ...tsConfig,
];

export default eslintConfig;
