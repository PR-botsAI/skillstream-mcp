// Markdown files are imported as plain strings via wrangler's Text rule
declare module "*.md" {
  const content: string;
  export default content;
}
