interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly DEBUG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
