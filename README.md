# NoTouchy

"NoTouchy" is a GitHub Action that ensures specific files aren't modified in pull requests, unless the contributor is authorized.

## Features

- Protect files based on a regex pattern.
- Allow exceptions: Certain GitHub users can be authorized to modify protected files, based on a `.git_RBAC` file in the repository root.

## Inputs

### `regex-pattern`

**Required** The regex pattern to match file names. For example, use `\.config$` to protect all files ending with `.config`.

### `github-token`

**Required** The GitHub token to authenticate and retrieve PR data. Default is `github.token`.

## Setup

1. **Create a `.git_RBAC` File (Optional)**:

If you want to allow certain users to modify protected files, create a `.git_RBAC` file in the root of your repository. List the GitHub usernames of the authorized users, one per line:

```text
allowedUser1
allowedUser2
```

2. **Add the Action to Your Workflow**:

```yaml
name: Check Protected Files

on: [pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2

    - name: Run NoTouchy
      uses: amshamah419/NoTouchy@v1.0.2
      with:
        regex-pattern: 'pattern_here'
        github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Feedback and Contributions
Feedback, issues, and pull requests are welcome in the [NoTouchy](https://github.com/amshamah419/NoTouchy) repository.


