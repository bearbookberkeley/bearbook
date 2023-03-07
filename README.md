# Bearbook

## Description

An e-commerce website for UC Berkeley students to safely sell and buy used textbooks. We target UC Berkeley students with a CalNet ID to ensure a safe and credible platform that is not gauranteed with other sites.

## Conributing

### Setup

1. Clone the repository

```bash
# in the directory you want to clone the repository

git clone https://github.com/bearbookberkeley/bearbook.git
cd bearbook
```

2. Install dependencies with `npm install`

```bash
# /bearbook

cd backend
npm install
```

### Workflow

1. Create a new branch for your feature

```bash
git checkout -b <branch-name>
```

2. Make your changes and run the linter

```bash
# /bearbook/backend

npm run lint
```

3. Commit your changes and push to the remote repository

```bash
git add <files>
git commit -m "<commit message>"
git push -u origin <branch-name>
```

4. Pull main into your branch

```bash
git checkout main
git pull
git checkout <branch-name>
git merge main
```

5. Create a pull request on GitHub

6. Once your pull request is approved, merge it into the master branch
