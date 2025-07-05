const fs = require("fs");
const path = require("path");

const contextDir = "./src/context";

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

const files = findTsFiles(contextDir);

files.forEach((filePath) => {
  let content = fs.readFileSync(filePath, "utf8");
  content = content.replace(/&ldquo;/g, '"');
  content = content.replace(/&rdquo;/g, '"');
  fs.writeFileSync(filePath, content);
  console.log(`Fixed: ${path.relative(".", filePath)}`);
});

console.log("All src/context files fixed!");
