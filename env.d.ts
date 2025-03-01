declare namespace NodeJS {
    interface ProcessEnv {
      NOTION_TOKEN: string;
      NOTION_DATABASE_MBMBER_ID: string;
      NOTION_DATABASE_ACTIVITY_ID: string;
      NODE_ENV: "development" | "production";
    }
  }
