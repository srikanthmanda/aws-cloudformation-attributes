const fs = require("fs");
const readline = require("readline");

async function createAttributesFile(input) {
  const PAGE_START = "# ";
  const SECTION_START = "## ";
  // const RETURN_VALUES_SECTION_START = SECTION_START + "Return Values";
  const RETURN_VALUES_SECTION_START = "## Return values";

  const LINE_FILTER_REGEX = "For more information about using the ";
  const NAME_ANCHOR_REGEX = /<a name="[\w+:-]*"><\/a>$/;

  const output = input.replace(/\.md$/, "_attributes.md");
  const attributesFile = fs.createWriteStream(output);

  const rl = readline.createInterface({
    input: fs.createReadStream(input),
    crlfDelay: Infinity,
  });

  console.log("Input: " + input);

  let inReturnValuesSection = false;
  let linesProcessed = 0;
  let entity;

  for await (const line of rl) {
    linesProcessed++;
    if (!inReturnValuesSection && line.startsWith(PAGE_START)) {
      entity = line.split("<", 1)[0];
    } else if (line.startsWith(RETURN_VALUES_SECTION_START)) {
      console.debug("Return values section is at line " + linesProcessed);
      inReturnValuesSection = true;
      attributesFile.write(entity + "\n");
    } else if (inReturnValuesSection && line.startsWith(SECTION_START)) {
      attributesFile.end();
      console.debug("Lines processed: " + linesProcessed);
      // Return at the end of Return Values section
      return true;
    } else if (inReturnValuesSection && !line.startsWith(LINE_FILTER_REGEX)) {
      attributesFile.write(line.replace(NAME_ANCHOR_REGEX, "") + "\n");
    }
  }

  // Delete the attributes file if the entity has no return values
  // If the input has Return Values, this function returns at that section end
  fs.unlink(output);
}

createAttributesFile("test/data/aws-properties-ec2-instance.md");
// export { createAttributesFile };
