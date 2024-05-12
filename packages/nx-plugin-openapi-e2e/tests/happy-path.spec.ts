// Nrwl
import { runNxCommand, uniq } from '@nx/plugin/testing';
import { execSync } from 'child_process';
import { existsSync, mkdirSync, rmSync } from 'fs';
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

describe('Happy-path', () => {
  let apiSpecLibName: string;
  let apiLibLibName: string;

  beforeEach(() => {
    apiSpecLibName = uniq('api-spec');
    apiLibLibName = uniq('api-lib');
  });

  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject();

    Object.assign(process.env, { NX_DAEMON: false });

    // The plugin has been built and published to a local registry in the jest globalSetup
    // Install the plugin built with the latest source code into the test repo
    execSync(`npm install @driimus/nx-plugin-openapi@e2e`, {
      cwd: projectDirectory,
      stdio: 'inherit',
      env: process.env,
    });
  });

  afterAll(() => {
    // Cleanup the test project
    rmSync(projectDirectory, {
      recursive: true,
      force: true,
    });
  });

  it('should work with a local spec', () => {
    runNxCommand(`generate @driimus/nx-plugin-openapi:api-spec ${apiSpecLibName} --withSample`);

    runNxCommand(
      [
        'generate',
        '@driimus/nx-plugin-openapi:api-lib',
        apiLibLibName,
        '--generator=typescript-fetch',
        `--sourceSpecLib=${apiSpecLibName}`,
        `--sourceSpecFileRelativePath=src/${apiSpecLibName}.openapi.yml`,
      ].join(' '),
    );

    const execute = runNxCommand(`run ${apiLibLibName}:generate-sources`);

    // TODO devise proper expectations
    expect(execute).toContain('Done deleting outputDir');
    expect(existsSync(`./tmp/nx-e2e/proj/libs/${apiLibLibName}/src/index.ts`)).toBe(true);
  }, 120000);

  // TODO
  it.skip('should work with docker', () => {
    runNxCommand(`generate @driimus/nx-plugin-openapi:api-spec ${apiSpecLibName} --withSample`);

    runNxCommand(
      [
        'generate',
        '@driimus/nx-plugin-openapi:api-lib',
        apiLibLibName,
        '--useDockerBuild=true',
        '--generator=typescript-fetch',
        `--sourceSpecLib=${apiSpecLibName}`,
        `--sourceSpecFileRelativePath=src/${apiSpecLibName}.openapi.yml`,
      ].join(' '),
    );

    const execute = runNxCommand(`run ${apiLibLibName}:generate-sources`);

    // TODO devise proper expectations
    expect(execute).toContain('Done deleting outputDir');
    expect(existsSync(`./tmp/nx-e2e/proj/libs/${apiLibLibName}/src/index.ts`)).toBe(true);
  }, 120000);

  it('should work with a remote spec', () => {
    runNxCommand(
      [
        'generate',
        '@driimus/nx-plugin-openapi:api-lib',
        apiLibLibName,
        '--generator=typescript-fetch',
        '--isRemoteSpec=true',
        '--sourceSpecUrl=https://petstore.swagger.io/v2/swagger.json',
      ].join(' '),
    );

    const execute = runNxCommand(`run ${apiLibLibName}:generate-sources`);

    // TODO devise proper expectations
    expect(execute).toContain('Done deleting outputDir');
  }, 120000);

  describe('When using the --global-properties option', () => {
    it('should work with just one value', async () => {
      runNxCommand(`generate @driimus/nx-plugin-openapi:api-spec ${apiSpecLibName} --withSample`);

      runNxCommand(
        [
          'generate',
          '@driimus/nx-plugin-openapi:api-lib',
          apiLibLibName,
          '--generator=typescript-fetch',
          `--sourceSpecLib=${apiSpecLibName}`,
          `--sourceSpecFileRelativePath=src/${apiSpecLibName}.openapi.yml`,
          `--global-properties=apis`,
        ].join(' '),
      );

      const execute = runNxCommand(`run ${apiLibLibName}:generate-sources`);

      // TODO devise proper expectations
      expect(execute).toContain('Done deleting outputDir');
    }, 120000);

    it('should work with multiple values', async () => {
      runNxCommand(`generate @driimus/nx-plugin-openapi:api-spec ${apiSpecLibName} --withSample`);

      runNxCommand(
        [
          'generate',
          '@driimus/nx-plugin-openapi:api-lib',
          apiLibLibName,
          '--generator=typescript-fetch',
          `--sourceSpecLib=${apiSpecLibName}`,
          `--sourceSpecFileRelativePath=src/${apiSpecLibName}.openapi.yml`,
          `--global-properties=apis,supportingFiles=runtime.ts`,
        ].join(' '),
      );

      const execute = runNxCommand(`run ${apiLibLibName}:generate-sources`);

      // TODO devise proper expectations
      expect(execute).toContain('Done deleting outputDir');
    }, 120000);
  });
});
