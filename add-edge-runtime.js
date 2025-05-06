// Script to add Edge runtime to Next.js pages
const fs = require("fs");
const path = require("path");

const APP_DIR = path.join(__dirname, "src", "app");

// Files that should be excluded (client components)
const CLIENT_COMPONENTS = [
  // Add paths to client components here if needed
];

function processFile(filePath) {
  // Skip files in the exclude list
  if (CLIENT_COMPONENTS.some((exclude) => filePath.includes(exclude))) {
    console.log(`Skipping client component: ${filePath}`);
    return;
  }

  // Read the file content
  const content = fs.readFileSync(filePath, "utf8");

  // Check if the file already has the runtime declaration
  if (content.includes('export const runtime = "edge"')) {
    console.log(`File already has runtime declaration: ${filePath}`);
    return;
  }

  // Check if it's a client component
  if (content.includes('"use client"') || content.includes("'use client'")) {
    console.log(`Skipping client component: ${filePath}`);
    return;
  }

  // Add the runtime declaration at the beginning of the file
  let newContent;
  if (content.includes("export default")) {
    newContent = `export const runtime = "edge";\n\n${content}`;
    fs.writeFileSync(filePath, newContent);
    console.log(`Added runtime declaration to: ${filePath}`);
  } else {
    console.log(`File doesn't seem to be a valid page component: ${filePath}`);
  }
}

function traverseDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      traverseDirectory(fullPath); // Recursively process subdirectories
    } else if (
      stats.isFile() &&
      (file === "page.js" ||
        file === "page.tsx" ||
        file === "route.js" ||
        file === "route.ts")
    ) {
      processFile(fullPath);
    }
  }
}

// Start processing from the app directory
traverseDirectory(APP_DIR);
console.log("Done processing files!");
