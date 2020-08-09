const fs = require("fs");
const { request } = require("@octokit/request");

async function getRepoArchive() {
  const repoArchive = await request(
    "GET /repos/:owner/:repo/:archive_format/:ref",
    {
      owner: "awsdocs",
      repo: "aws-cloudformation-user-guide",
      archive_format: "zipball",
      ref: "master",
    }
  );
  console.log("repoArchiveURL: " + JSON.stringify(repoArchive));

  // TODO: Save the response data to a zip file
}

getRepoArchive();
