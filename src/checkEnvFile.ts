/* eslint-disable no-console */
import * as fs from 'fs';
import * as path from 'path';

const checkEnvFile = () => {
  const envFilePath = path.join(process.cwd(), '.env');

  try {
    // Check if the .env file exists
    fs.accessSync(envFilePath, fs.constants.R_OK);
    console.log('.env file found!');
  } catch (err) {
    console.error(
      'Error: .env file not found. See the README: https://github.com/IABTechLab/uid2-self-serve-portal?tab=readme-ov-file#environment-variables'
    );

    process.exit(1); // Exit with a non-zero status code to indicate failure
  }
};

checkEnvFile();
