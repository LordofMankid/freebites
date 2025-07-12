// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");

if (process.env.NODE_ENV !== "production") {
    // Only load dotenv in local dev environment
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("dotenv").config();
}
const token = process.env.GITHUB_TOKEN;
if (!token) {
    console.error("❌ Missing GITHUB_TOKEN in .env");
    process.exit(1);
}

const scope = "@freebites";

fs.writeFileSync(
    ".npmrc",
    `${scope}:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=${token}\n`
);

console.log("✅ .npmrc created");
