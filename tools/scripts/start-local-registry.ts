/**
 * This script starts a local registry for e2e testing purposes.
 * It is meant to be used as vitest's globalSetup.
 */
import { workspaceRoot } from '@nx/devkit';
import { startLocalRegistry } from '@nx/js/plugins/jest/local-registry';
import { releasePublish, releaseVersion } from 'nx/release';
import { join } from 'path';

export default async () => {
  // local registry target to run
  const localRegistryTarget = 'root:local-registry';
  // storage folder for the local registry
  const storage = join(workspaceRoot, 'tmp/local-registry/storage');

  const stopLocalRegistry = await startLocalRegistry({
    localRegistryTarget,
    storage,
    verbose: false,
  });

  await releaseVersion({
    specifier: '0.0.0-e2e',
    stageChanges: false,
    gitCommit: false,
    gitTag: false,
    firstRelease: true,
    versionActionsOptionsOverrides: {
      skipLockFileUpdate: true,
    },
  });
  await releasePublish({
    tag: 'e2e',
    firstRelease: true,
  });

  // vitest calls the returned function as the global teardown
  return stopLocalRegistry;
};
