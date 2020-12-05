const fs = require('fs');
const readline = require('readline');

async function createCheatsheet(indexFile, cheatSheet) {
  const FOOTER = '- - -\n'
    + 'This document was generated from [AWS CloudFormation User Guide]'
    + '(https://github.com/awsdocs/aws-cloudformation-user-guide) '
    + 'using [`aws-cloudformation-attributes`]'
    + '(https://github.com/srikanthmanda/aws-cloudformation-attributes).';
  const dataMap = {};

  const rl = readline.createInterface({
    input: fs.createReadStream(indexFile),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const fields = line.split(',');
    const entityNames = fields[0].split('::');
    const api = entityNames[1];
    const entity = entityNames[2];
    const attributesFile = fields[1];

    if (dataMap[api]) {
      dataMap[api][entity] = attributesFile;
    } else {
      dataMap[api] = {};
      dataMap[api][entity] = attributesFile;
    }
  }

  const cheatSheetBody = cheatSheet.replace(/\.md$/, '_body.md');
  fs.writeFileSync(
    cheatSheet,
    '# AWS CloudFormation Attributes\n\n## Table of Contents\n',
  );

  for (const api of Object.keys(dataMap).sort()) {
    fs.appendFileSync(cheatSheet, `\n### AWS::${api}\n`);
    for (const entity of Object.keys(dataMap[api]).sort()) {
      fs.appendFileSync(
        cheatSheetBody,
        `\n#${fs.readFileSync(dataMap[api][entity])}`,
      );
      fs.appendFileSync(
        cheatSheet,
        `* [AWS::${
          api
        }::${
          entity
        }](#aws${
          (api + entity).toLowerCase()
        })\n`,
      );
    }
  }

  fs.appendFileSync(cheatSheet, fs.readFileSync(cheatSheetBody));
  fs.appendFileSync(cheatSheet, FOOTER);
  console.log(`cheatSheet created: ${cheatSheet}`);
  fs.unlink(cheatSheetBody, (error) => {
    if (error) {
      console.error(`Failed to delete cheatSheet body: ${cheatSheetBody}`);
      console.error(`Error: ${JSON.stringify(error)}`);
    } else {
      console.debug(`Deleted cheatSheet body: ${cheatSheetBody}`);
    }
  });
}

// createCheatsheet(
//   "output/aws_cloudformation_attributes_index.csv",
//   "aws-cloudformation-attributes.md"
// );
exports.createCheatsheet = createCheatsheet;
