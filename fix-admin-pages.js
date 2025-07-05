const fs = require("fs");
const path = require("path");

const adminPagesDir = "./src/app/(dashboard)/admin";

// Function to recursively find all TypeScript files
function findTsFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      files.push(...findTsFiles(itemPath));
    } else if (item.endsWith(".tsx") || item.endsWith(".ts")) {
      files.push(itemPath);
    }
  });

  return files;
}

// Get all TypeScript files in the admin directory
const files = findTsFiles(adminPagesDir);

files.forEach((filePath) => {
  let content = fs.readFileSync(filePath, "utf8");

  // Replace HTML entities with normal quotes
  content = content.replace(/&ldquo;/g, '"');
  content = content.replace(/&rdquo;/g, '"');

  fs.writeFileSync(filePath, content);
  console.log(`Fixed: ${path.relative(".", filePath)}`);
});

console.log("All admin pages fixed!");
