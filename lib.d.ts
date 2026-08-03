declare module "eslint-plugin-security" {
  interface PluginConfig {
    rules?: Record<string, unknown>;
  }

  interface SecurityPlugin {
    configs: {
      recommended: PluginConfig;
    };
  }

  const security: SecurityPlugin;
  export default security;
}
