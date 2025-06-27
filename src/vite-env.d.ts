/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    // adicione outras variáveis se precisar
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  