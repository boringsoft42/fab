const fs = require("fs");
const path = require("path");

const uiComponentsDir = "./src/components/ui";

// Get all TypeScript files in the UI components directory
const files = fs
  .readdirSync(uiComponentsDir)
  .filter((file) => file.endsWith(".tsx") || file.endsWith(".ts"));

files.forEach((file) => {
  const filePath = path.join(uiComponentsDir, file);
  let content = fs.readFileSync(filePath, "utf8");

  // Replace HTML entities with normal quotes
  content = content.replace(/&ldquo;/g, '"');
  content = content.replace(/&rdquo;/g, '"');

  fs.writeFileSync(filePath, content);
  console.log(`Fixed: ${file}`);
});

console.log("All UI components fixed!");
