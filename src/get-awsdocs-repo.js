const fs = require('fs');
const { request } = require('@octokit/request');

async function getRepoArchive() {
  const repoArchive = await request(
    'GET /repos/:owner/:repo/:archive_format/:ref',
    {
      owner: 'awsdocs',
      repo: 'aws-cloudformation-user-guide',
      archive_format: 'zipball',
      ref: 'main',
    },
  );
  console.debug(`repoArchiveURL: ${JSON.stringify(repoArchive)}`);

  const repoZip = fs.createWriteStream('aws-cloudformation-user-guide.zip');
  repoZip.write(Buffer.from(repoArchive.data));
}

// getRepoArchive();
exports.getRepoArchive = getRepoArchive;
