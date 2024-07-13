import { init, loadRemote } from '@module-federation/enhanced/runtime';

init({
  name: 'rspact_remote_mfe',
  remotes: [
    {
      name: "rspact_remote",
      entry: "http://localhost:3000/mf-manifest.json",
      alias: "remote",
    },
  ],
});

export const loadRemoteModule = () => {
  return async () => {
    const container = await loadRemote('remote/rspack_remoteApp');
    if (!container) {
      throw new Error(`Remote container "${remoteName}" is not found.`);
    }
    return container;
  };
};