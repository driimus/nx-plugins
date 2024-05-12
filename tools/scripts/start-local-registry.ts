/**
 * This script starts a local registry for e2e testing purposes.
 * It is meant to be called in jest's globalSetup.
 */
import type { Config } from '@jest/types';
import { startLocalRegistry } from '@nx/js/plugins/jest/local-registry';
import { releasePublish, releaseVersion } from 'nx/release';
import { join } from 'path';
import { tmpdir } from 'tmp';

export default async (globalConfig: Config.GlobalConfig) => {
  // local registry target to run
  const localRegistryTarget = 'root:local-registry';
  // storage folder for the local registry
  const storage = './tmp/local-registry/storage';

  // global.stopLocalRegistry = await startLocalRegistry({
  //   localRegistryTarget,
  //   storage,
  //   verbose: false,
  // });
  const isVerbose: boolean = process.env.NX_VERBOSE_LOGGING === 'true' || !!globalConfig.verbose;
  const storageLocation = join(tmpdir, 'local-registry/storage', process.env.NX_TASK_TARGET_PROJECT ?? '');
  global.stopLocalRegistry = await startLocalRegistry({
    localRegistryTarget,
    verbose: isVerbose,
    storage: storageLocation,
  });

  await releaseVersion({
    specifier: '0.0.0-e2e',
    stageChanges: false,
    gitCommit: false,
    gitTag: false,
    firstRelease: true,
    generatorOptionsOverrides: {
      skipLockFileUpdate: true,
    },
  });
  await releasePublish({
    tag: 'e2e',
    firstRelease: true,
  });
};
