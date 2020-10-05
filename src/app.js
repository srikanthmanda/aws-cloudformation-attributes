const gra = require("./get-awsdocs-repo");
const ef = require("./extract-zip");
const caf = require("./create-attributes-file");
const ccs = require("./create-cheatsheet");

async function main() {
  try {
    await gra.getRepoArchive();
    console.log("Archive downloaded.");
  } catch (error) {
    console.error(
      "Archive download failed. Exception: " + JSON.stringify(error)
    );
  }

  try {
    await ef.extractEntityFiles("aws-cloudformation-user-guide.zip", "data");
    console.log("Archive extracted.");
  } catch (error) {
    console.error(
      "Archive extraction failed. Exception: " + JSON.stringify(error)
    );
  }

  try {
    await caf.createAttributeFiles("data", "output");
    console.log("Attribute files created.");
  } catch (error) {
    console.error(
      "Attribute files creation failed. Exception: " + JSON.stringify(error)
    );
  }

  try {
    await ccs.createCheatsheet(
      "output/aws_cloudformation_attributes_index.csv",
      "docs/index.md"
    );
    console.log("Cheatsheet created.");
  } catch (error) {
    console.error(
      "Cheatsheet creation failed. Exception: " + JSON.stringify(error)
    );
  }
}

main();
