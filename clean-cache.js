const fs = require('fs');
const path = require('path');

// Function to remove directory recursively
function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        removeDirectory(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
}

// Directories to clean
const dirsToClean = [
  '.next',
  'node_modules/.cache',
  '.turbo'
];

console.log('🧹 Cleaning cache directories...');

dirsToClean.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`Removing ${dir}...`);
    removeDirectory(dir);
    console.log(`✅ ${dir} removed`);
  } else {
    console.log(`ℹ️ ${dir} does not exist, skipping...`);
  }
});

console.log('✨ Cache cleaning completed!');
console.log('🚀 You can now run "npm run dev" to start the development server');
