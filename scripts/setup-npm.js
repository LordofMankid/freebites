// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
const token = process.env.GITHUB_TOKEN;

if (!token) {
    console.error('GITHUB_TOKEN not found in .env');
    process.exit(1);
}

const npmrc = `@freebites:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${token}
`;

fs.writeFileSync('.npmrc', npmrc);
console.log('.npmrc created successfully');