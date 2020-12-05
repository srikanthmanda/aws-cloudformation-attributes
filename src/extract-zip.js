// TODO:
// 1. Maybe apply `stream.Transform` to read files line by line and
//    get return values as the repo is unzipped?

const yauzl = require('yauzl');
const fs = require('fs');

function extractEntityFiles(repoArchive, dataDir) {
  return new Promise((resolve, reject) => {
    const RESOURCE_FILE_NAME_REGEX = /^aws-resource-.*\.md$/;
    const PROPERTIES_FILE_NAME_REGEX = /^aws-properties-.*\.md$/;

    yauzl.open(repoArchive, { lazyEntries: true }, (err, repoZip) => {
      if (err) return reject(err);
      let numOfEntityFiles = 0;
      repoZip.readEntry();
      repoZip.on('entry', (entry) => {
        if (/\/$/.test(entry.fileName)) {
          // Diretory entry
          console.log(`Directory: ${entry.fileName}`);
          repoZip.readEntry();
        } else {
          // File entry
          const fileEntry = entry.fileName.split('/').reverse()[0];
          // Extract only resource and properties files
          if (
            RESOURCE_FILE_NAME_REGEX.test(fileEntry)
            || PROPERTIES_FILE_NAME_REGEX.test(fileEntry)
          ) {
            numOfEntityFiles++;
            const unzippedFile = fs.createWriteStream(
              `${dataDir}/${fileEntry}`,
            );
            repoZip.openReadStream(entry, (err, readStream) => {
              if (err) throw err;
              readStream.on('end', () => {
                repoZip.readEntry();
              });
              readStream.pipe(unzippedFile);
            });
          } else {
            repoZip.readEntry();
          }
        }
      });
      repoZip.on('end', () => {
        repoZip.close();
        console.info(`Entity files extracted: ${numOfEntityFiles}`);
        resolve();
      });
    });
  });
}

// extractEntityFiles("aws-cloudformation-user-guide.zip", "data")
//   .then(() => console.log("Zip file extracted"))
//   .catch((err) => console.log(err));
exports.extractEntityFiles = extractEntityFiles;
