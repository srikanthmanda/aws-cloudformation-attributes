const fs = require('fs');
const readline = require('readline');

async function createAttributesFile(input, outputDir, indexFile) {
  const PAGE_START = '# ';
  const SECTION_START = '## ';
  // const RETURN_VALUES_SECTION_START = SECTION_START + "Return Values";
  const RETURN_VALUES_SECTION_START = '## Return values';

  const LINE_FILTER_REGEX = /For more information about using |The following are the available attributes and sample return values|####/;
  const NAME_ANCHOR_REGEX = /<a name="[\w+:-]*"><\/a>$/;

  const output = `${outputDir
  }/${
    input.split('/').reverse()[0].replace(/\.md$/, '_attributes.md')}`;
  const attributesFile = fs.createWriteStream(output);

  const rl = readline.createInterface({
    input: fs.createReadStream(input),
    crlfDelay: Infinity,
  });

  console.info(`Input: ${input}`);

  let inReturnValuesSection = false;
  let hasReturnValues = false;
  let linesRead = 0;
  let entity;

  for await (const line of rl) {
    linesRead += 1;
    if (!inReturnValuesSection && line.startsWith(PAGE_START)) {
      entity = line.split('<', 1)[0];
    } else if (line.startsWith(RETURN_VALUES_SECTION_START)) {
      inReturnValuesSection = true;
      hasReturnValues = true;
      attributesFile.write(`${entity}\n`);
      console.debug(
        `Return Values section of ${input} is at line ${linesRead}`,
      );
    } else if (inReturnValuesSection && line.startsWith(SECTION_START)) {
      break;
    } else if (
      inReturnValuesSection
        && !LINE_FILTER_REGEX.test(line)
    ) {
      attributesFile.write(`${line.replace(NAME_ANCHOR_REGEX, '')}\n`);
    }
  }

  attributesFile.end();

  if (hasReturnValues) {
    fs.appendFileSync(indexFile, `${entity},${output}\n`);
    console.debug(`Index updated for ${input}`);
    console.debug(`Lines read in ${input}: ${linesRead}`);
  } else {
    fs.unlink(output, (error) => {
      if (error) {
        console.error(`Failed to delete empty output: ${output}`);
        console.error(`Error: ${JSON.stringify(error)}`);
      } else {
        console.debug(`Deleted empty output: ${output}`);
      }
    });
  }
}

async function createAttributeFiles(inputDir, outputDir) {
  const INDEX_FILE = 'aws_cloudformation_attributes_index.csv';
  const indexFile = `${outputDir}/${INDEX_FILE}`;
  const RESOURCE_FILE_NAME_REGEX = /^aws-resource-.*\.md$/;
  const PROPERTIES_FILE_NAME_REGEX = /^aws-properties-.*\.md$/;

  let docFiles;

  try {
    docFiles = fs
      .readdirSync(inputDir)
      .filter(
        (file) => RESOURCE_FILE_NAME_REGEX.test(file)
          || PROPERTIES_FILE_NAME_REGEX.test(file),
      );
  } catch (error) {
    console.error(`Failed to read directory: ${inputDir}`);
    throw error;
  }

  console.debug(`Entity files found: ${docFiles.length}`);

  if (fs.existsSync(indexFile)) fs.unlinkSync(indexFile);

  await Promise.all(
    docFiles.map(async (docFile) => {
      try {
        await createAttributesFile(
          `${inputDir}/${docFile}`,
          outputDir,
          indexFile,
        );
      } catch (error) {
        console.error(`Error processing ${docFile}`);
        throw error;
      }
    }),
  );
}

// createAttributeFiles("data", "output").then(() =>
//   console.log("Attribute files created")
// );
exports.createAttributeFiles = createAttributeFiles;
