# RSPack Micro-frontend Example (WIP)

This repository demonstrates how to set up a host and remote micro frontend (MFE) using RSPack and Module Federation, with dynamic runtime configuration.

## Project Structure

- `rspack_host`: The host application.
- `rspack_remote`: The remote application.

### Setting Up Environment Variables

Create a `.env` file in both `rspack_host` and `rspack_remote` directories with the following content:

Running the Host Application

### Navigate to the rspack_host directory and run:

```
cd rspack_host
yarn start
```

### Running the Remote Application

Navigate to the rspack_remote directory and run:

```
cd rspack_remote
yarn start
```

Remote Configuration (`rspack_remote/rspack.config.js`)

The remote application should be similarly configured to expose its modules.

Using the Chrome Module Federation Plugin

To use the Chrome Module Federation plugin for debugging:

    - Open your application in Google Chrome.
    - Open Chrome DevTools.
    - Navigate to the "Module Federation" tab.
    - Ensure your MFEs are being picked up by the tool.


---

License

This project is licensed under the MIT License.

