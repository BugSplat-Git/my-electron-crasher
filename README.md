[![bugsplat-github-banner-basic-outline](https://user-images.githubusercontent.com/20464226/149019306-3186103c-5315-4dad-a499-4fd1df408475.png)](https://bugsplat.com)
<br/>

# <div align="center">BugSplat</div>

### **<div align="center">Crash and error reporting built for busy developers.</div>**

## This sample has moved

The maintained Electron sample now lives in the [`example/`](https://github.com/BugSplat-Git/bugsplat-electron/tree/main/example) directory of [**bugsplat-electron**](https://github.com/BugSplat-Git/bugsplat-electron), next to the [`@bugsplat/electron`](https://www.npmjs.com/package/@bugsplat/electron) SDK it demonstrates (it doubles as the SDK's end-to-end test fixture). This repository is archived and kept for reference only.

Integrating BugSplat into an Electron app is now a single `init()` call in the main process — native Crashpad crashes from every process, JavaScript errors in main and renderer, renderer hangs with JavaScript call stacks, out-of-memory crashes, and one identity everywhere:

```ts
import { init } from '@bugsplat/electron';

// application and version default to app.name and app.getVersion()
init({ database: 'your-bugsplat-database' });
```

See the [Electron integration docs](https://docs.bugsplat.com/introduction/getting-started/integrations/desktop/electron) for details.
