// env-loader.js
const fs = require('fs');
const dotenv = require('dotenv');

const produ = process.env.npm_lifecycle_event === 'prebuild';
const envFile = produ ? '.env.production' : '.env';

const result = dotenv.config({ path: envFile });
if (result.error) {
  throw result.error;
}

const envConfig = result.parsed;
const targetPath = './src/environments/environment.generated.ts';

console.log(`Using environment file: ${envFile}`);
console.log(envConfig);

const envFileContent = `
export const environment = {
    production: ${produ},
    apiUrl: '${envConfig.API_URL.replace(/\/+$/, '')}',
};
`;

fs.writeFileSync(targetPath, envFileContent);