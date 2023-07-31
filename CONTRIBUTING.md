# Contributing

Thank you for investing your time in contributing to React OAuth project! We greatly
appreciate any work contributed, no matter how small!

## How to report bugs and propose new features

If you spot a problem in the project or want to propose an improvement.
[Search if an issue already exists](https://github.com/MomenSherif/react-oauth/issues). I
When similar issue doesn't exist, you can [open a new issue](https://github.com/MomenSherif/react-oauth/issues/new/).

## Setup local environment

If you don't have React OAuth running locally please follow this setup guide.

1. Install the newest LTS release of [Node.js](https://nodejs.org/en/), it has the
   [npm](https://www.npmjs.com/package/node-fetch) package manager bundled with it.
1. Fork this repository using [Fork](https://github.com/MomenSherif/react-oauth/fork) button.
   This will create a new repository on your account named `<your username>/react-oauth`
1. Clone this repo to wherever you want:
   ```sh
   git clone https://github.com/<your username>/react-oauth.git
   ```
1. Go into the repo folder:
   ```sh
   cd react-oauth
   ```
1. Install dependencies (Node.js and npm are required):
   ```sh
   npm install
   ```
1. Run the development server. It's going to recompile the `@react-oauth/google` and run a
   web server with playground.
   ```sh
   npm run dev:google
   ```
1.
1. Navigate to [http://localhost:3000/](http://localhost:3000/)

Now you have a playground that will recompile every time you make changes to the library.

## Pull Request Process

For Pull Request to be accepted you need to follow some additional steps:

1. Fork the project and clone it to your local machine. Follow the [setup guide](#setup-local-environment).
1. Before making any changes, pull from the remote repository to update your main branch
   ```sh
      git pull upstream master
   ```
1. Create a branch on which you will be working.
   ```sh
       git checkout -b fix-hook-typo
   ```
1. Make your changes
1. Run changelog command, it will allow you to describe the changes that you've made and
   bump the project version.
   ```sh
   npm run changeset
   ```
1. Commit your changes and push them to your fork of the repository. Your commit name needs
   to follow [https://www.conventionalcommits.org/en/v1.0.0/] or pre-commit checks will fail.
1. Create a Pull Request (PR). Make sure to describe the changes that you made and use the
   `Fixes: #number` keyword if you were working on an issue.
1. Congratulations! You now need to wait for maintainer to review your Pull Request.
