// decale module env and all the variables that are in the .env file

declare module '@env' {
    export const SPOTIFY_CLIENT_ID: string;
    export const SPOTIFY_CLIEN_SECRET: string;
    export const NOTION_SECRET: string;
    export const NOTION_DATABASE_ID: string;
}