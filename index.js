const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs').promises;

async function getAuthorizedUsers() {
    try {
        const data = await fs.readFile('.git_RBAC', 'utf8');
        return data.split(/\r?\n/).filter(Boolean);  // Split by newline and filter out empty lines
    } catch (error) {
        core.warning('.git_RBAC file not found or unreadable.');
        return [];
    }
}

async function run() {
    try {
        const regexPattern = core.getInput('regex-pattern');
        const regex = new RegExp(regexPattern, 'i');

        const pr = github.context.payload.pull_request;
        const { owner, repo } = github.context.repo;

        const token = core.getInput('github-token', { required: true });
        const octokit = new github.GitHub(token);

        const { data: files } = await octokit.pulls.listFiles({
            owner,
            repo,
            pull_number: pr.number
        });

        const matchedFiles = files.filter(file => regex.test(file.filename));

        if (matchedFiles.length) {
            const authorizedUsers = await getAuthorizedUsers();
            if (!authorizedUsers.includes(pr.user.login)) {
                core.setFailed(`Protected files were modified: ${matchedFiles.map(file => file.filename).join(', ')}`);
            }
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
