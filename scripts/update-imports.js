// scripts/update-imports.js
const fs = require("fs");
const path = require("path");

// Folders to scan for JS/TS files
const scanFolders = [
  path.join(__dirname, "../Javascript"),
  path.join(__dirname, "../Components"),
  path.join(__dirname, "../Entities"),
  path.join(__dirname, "../Pages")
];

// Utility to get all .js, .ts, .tsx files recursively
function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath));
    } else if (file.match(/\.(js|ts|tsx)$/)) {
      results.push(filePath);
    }
  });
  return results;
}

// Placeholder: update imports (currently logs file paths)
function updateImports(filePath) {
  console.log("Processing:", filePath);

  let content = fs.readFileSync(filePath, "utf-8");

  // Example: replace old relative imports with new ones
  // content = content.replace(/old-import-path/g, "new-import-path");

  // fs.writeFileSync(filePath, content, "utf-8");
}

// Run through all files
scanFolders.forEach(folder => {
  if (fs.existsSync(folder)) {
    const files = getFiles(folder);
    files.forEach(updateImports);
  } else {
    console.warn("Folder not found:", folder);
  }
});

console.log("✅ Update imports script finished.");
