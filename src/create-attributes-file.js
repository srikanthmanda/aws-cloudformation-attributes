const fs = require("fs");
const readline = require("readline");

async function createAttributesFile(input) {
  const PAGE_START = "# ";
  const SECTION_START = "## ";
  // const RETURN_VALUES_SECTION_START = SECTION_START + "Return Values";
  const RETURN_VALUES_SECTION_START = "## Return values";

  const LINE_FILTER_REGEX = "For more information about using the ";
  const NAME_ANCHOR_REGEX = /<a name="[\w+:-]*"><\/a>$/;

  const output = fs.createWriteStream(input.replace(/\.md$/, "_attributes.md"));

  const rl = readline.createInterface({
    input: fs.createReadStream(input),
    crlfDelay: Infinity,
  });

  console.log("Input: " + input);

  var inReturnValuesSection = false;
  var linesProcessed = 0;

  for await (const line of rl) {
    linesProcessed++;
    if (!inReturnValuesSection && line.startsWith(PAGE_START)) {
      output.write(line.split("<", 1)[0] + "\n");
    } else if (line.startsWith(RETURN_VALUES_SECTION_START)) {
      console.debug("Return values section is at line " + linesProcessed);
      inReturnValuesSection = true;
    } else if (inReturnValuesSection && line.startsWith(SECTION_START)) {
      output.end();
      console.debug("Lines processed: " + linesProcessed);
      return;
    } else if (inReturnValuesSection && !line.startsWith(LINE_FILTER_REGEX)) {
      output.write(line.replace(NAME_ANCHOR_REGEX, "") + "\n");
    }
  }
}

// createAttributesFile("../test/data/aws-properties-ec2-instance.md");

export { createAttributesFile };
