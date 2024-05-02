import { appRootPath } from '@nx/devkit';
import {
  checkFilesExist,
  newNxProject,
  readJson,
  runCommandAsync,
  runNxCommandAsync,
  updateFile
} from '@nx/plugin/testing';
import { execSync } from 'child_process';
import { mkdirSync, rmSync } from 'fs';
import { dirname, join } from 'path';

/**
 * Creates a test project with create-nx-workspace and installs the plugin
 * @returns The directory where the test project was created
 */
function createTestProject() {
  const projectName = 'proj';
  const projectDirectory = join(process.cwd(), 'tmp/nx-e2e', projectName);

  // Ensure projectDirectory is empty
  rmSync(projectDirectory, {
    recursive: true,
    force: true,
  });
  mkdirSync(dirname(projectDirectory), {
    recursive: true,
  });

  execSync(`npx --yes create-nx-workspace@latest ${projectName} --preset apps --nxCloud=skip --no-interactive`, {
    cwd: dirname(projectDirectory),
    stdio: 'inherit',
    env: process.env,
  });

  return projectDirectory;
}

describe('nx-plugin-unused-deps', () => {
  const plugin = '@driimus/nx-plugin-unused-deps';

  let projectDirectory: string;

  beforeAll(async () => {
    projectDirectory = createTestProject()

    
    Object.assign(process.env, {NX_DAEMON: false})
    
    // The plugin has been built and published to a local registry in the jest globalSetup
    // Install the plugin built with the latest source code into the test repo
    execSync(`npm install @driimus/nx-plugin-unused-deps@e2e`, {
      cwd: projectDirectory,
      stdio: 'inherit',
      env: process.env,
    });


    await runCommandAsync('npm i react express; npm i -D jest @types/express');
    await runNxCommandAsync(`generate @nx/node:app --name=app --directory ${projectDirectory}/apps`);

    updateFile('./apps/app/src/main.ts', `import * as express from "express"; express();`);
  }, 200_000);

  it('should log unused deps to console', async () => {
    const { stdout } = await runNxCommandAsync(`generate ${plugin}:check`);

    expect(stdout).toContain('react');
    expect(stdout).toContain('jest');
    expect(stdout).not.toContain('express');
    expect(stdout).not.toContain('@types/express');
  }, 200_000);

  describe('--json', () => {
    it('should also log to a JSON file', async () => {
      await runNxCommandAsync(`generate ${plugin}:check --json`);

      expect(() => checkFilesExist(`.nx-plugin-unused-deps.json`)).not.toThrow();
    }, 200_000);
  });

  describe('--fix', () => {
    it('should delete unused deps from package.json', async () => {
      await runNxCommandAsync(`generate ${plugin}:check --fix`);

      const { dependencies, devDependencies } = readJson('package.json');
      expect(Object.keys(dependencies)).not.toContain('react');
      expect(Object.keys(devDependencies)).not.toContain('jest');
    }, 200_000);
  });
});
