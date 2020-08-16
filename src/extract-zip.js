// TODO:
// 1. Maybe apply `stream.Transform` to read files line by line and
//    get return values as the repo is unzipped?

const yauzl = require("yauzl");
const fs = require("fs");

function extractEntityFiles(repoArchive, dataDir) {
  const RESOURCE_FILE_NAME_REGEX = /^aws-resource-.*\.md$/;
  const PROPERTIES_FILE_NAME_REGEX = /^aws-properties-.*\.md$/;

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
        fileEntry = entry.fileName.split("/").reverse()[0];
        // Extract only resource and properties files
        if (
          RESOURCE_FILE_NAME_REGEX.test(fileEntry) ||
          PROPERTIES_FILE_NAME_REGEX.test(fileEntry)
        ) {
          numOfEntityFiles++;
          unzippedFile = fs.createWriteStream(dataDir + "/" + fileEntry);
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

// extractEntityFiles("aws-cloudformation-user-guide.zip", "data");
exports.extractEntityFiles = extractEntityFiles;
