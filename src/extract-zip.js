const yauzl = require("yauzl");
const fs = require("fs");

async function extractEntityFiles(repoArchive) {
  yauzl.open(repoArchive, { lazyEntries: true }, function (err, repoZip) {
    if (err) throw err;
    let numOfEntityFiles = 0;
    repoZip.readEntry();
    repoZip.on("entry", function (entry) {
      if (/\/$/.test(entry.fileName)) {
        // Diretory entry
        console.log("Directory: " + entry.fileName);
        repoZip.readEntry();
      } else {
        // File entry
        mdFile = entry.fileName.split("/").reverse()[0];
        // Extract only resource and properties files
        if (
          /^aws-resource-.*\.md$/.test(mdFile) ||
          /^aws-properties-.*\.md$/.test(mdFile)
        ) {
          numOfEntityFiles++;
          unzippedFile = fs.createWriteStream("data/" + mdFile);
          repoZip.openReadStream(entry, function (err, readStream) {
            if (err) throw err;
            readStream.on("end", function () {
              repoZip.readEntry();
            });
            readStream.pipe(unzippedFile);
          });
        } else {
          repoZip.readEntry();
        }
      }
    });
    repoZip.on("end", function () {
      console.info("Entity files extracted: " + numOfEntityFiles);
    });
  });
}

extractEntityFiles("aws-cloudformation-user-guide.zip");
// export { createAttributesFile };
