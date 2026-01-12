const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Define the desired widths
const widths = [320, 480, 768, 1024, 1280];

// Directory containing the images
const inputDir = path.join(__dirname, "..", "images");

// Output directory
const outputDir = path.join(__dirname, "..", "output");

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Process each image in the input directory
fs.readdirSync(inputDir).forEach((file) => {
  const inputFile = path.join(inputDir, file);
  const ext = path.extname(file);
  const name = path.basename(file, ext);

  // Process each specified width
  widths.forEach((width) => {
    const outputSubDir = path.join(outputDir, width.toString());

    // Ensure the subdirectory for the current width exists
    if (!fs.existsSync(outputSubDir)) {
      fs.mkdirSync(outputSubDir);
    }

    const outputFile = path.join(outputSubDir, `${name}_${width}${ext}`);

    // Resize the image
    sharp(inputFile)
      .resize({ width })
      .toFile(outputFile)
      .then(() => {
        console.log(`Resized ${file} to ${width}px width.`);
      })
      .catch((err) => {
        console.error(`Error resizing ${file} to ${width}px:`, err);
      });
  });
});
