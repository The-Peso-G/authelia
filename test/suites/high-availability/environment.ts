import DockerEnvironment from "../../helpers/context/DockerEnvironment";
import AutheliaServer from "../../helpers/context/AutheliaServer";
import { exec } from "../../helpers/utils/exec";
import fs from 'fs';

const composeFiles = [
  'docker-compose.yml',
  'example/compose/mongo/docker-compose.yml',
  'example/compose/redis/docker-compose.yml',
  'example/compose/nginx/backend/docker-compose.yml',
  'example/compose/nginx/portal/docker-compose.yml',
  'example/compose/smtp/docker-compose.yml',
  'example/compose/httpbin/docker-compose.yml',
  'example/compose/ldap/docker-compose.admin.yml', // This is just used for administration, not for testing.
  'example/compose/ldap/docker-compose.yml'
]

const dockerEnv = new DockerEnvironment(composeFiles);
const autheliaServer = new AutheliaServer(__dirname + '/config.yml');

async function setup() {
  // In dev mode Authelia has the server served on one port and the frontend on another port.
  await exec('./example/compose/nginx/portal/render.js ' + (fs.existsSync('.suite') ? '': '--production'));

  console.log(`Prepare environment with docker-compose...`);
  await dockerEnv.start();
  
  console.log('Start Authelia server.');
  await autheliaServer.start();
}

async function teardown() {
  console.log('Stop Authelia server.');
  await autheliaServer.stop();

  console.log(`Cleanup environment with docker-compose...`);
  await dockerEnv.stop();
}

export { setup, teardown, composeFiles };