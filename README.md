[![bugsplat-github-banner-basic-outline](https://user-images.githubusercontent.com/20464226/149019306-3186103c-5315-4dad-a499-4fd1df408475.png)](https://bugsplat.com)
<br/>
# <div align="center">BugSplat</div> 
### **<div align="center">Crash and error reporting built for busy developers.</div>**
<div align="center">
    <a href="https://twitter.com/BugSplatCo">
        <img alt="Follow @bugsplatco on Twitter" src="https://img.shields.io/twitter/follow/bugsplatco?label=Follow%20BugSplat&style=social">
    </a>
    <a href="https://discord.gg/K4KjjRV5ve">
        <img alt="Join BugSplat on Discord" src="https://img.shields.io/discord/664965194799251487?label=Join%20Discord&logo=Discord&style=social">
    </a>
</div>

# my-electron-crasher

The my-electron-crasher sample demonstrates how to use how to use Electron's [Crashpad](https://chromium.googlesource.com/crashpad/crashpad/+/refs/heads/main/doc/overview_design.md) based [crashReporter](https://github.com/electron/electron/blob/master/docs/api/crash-reporter.md) for tracking native crashes with BugSplat. This sample also demonstrates BugSplat's [npm package](https://www.npmjs.com/package/bugsplat-node) to track JavaScript/TypeScript errors in your Electron application.

## 🥾 Steps

1. `git clone https://github.com/BugSplat-Git/my-electron-crasher`
2. `cd my-electron-crasher && npm i`
3. `npm start` which will run the build and upload source maps via [@bugsplat/symbol-upload](https://www.npmjs.com/package/@bugsplat/symbol-upload)
4. Click any of the buttons in the app to test the BugSplat integration
5. Navigate to BugSplat's [Crashes](https://app.bugsplat.com/v2/crashes) page in your web browser
6. When prompted to log in, use the username `fred@bugsplat.com` and password `Flintstone`
7. Click the ID of your crash to see crash details

For more information about getting started with Electron check out the [Quick Start Guide](http://electron.atom.io/docs/tutorial/quick-start) within the Electron documentation. For additional help using BugSplat, check out the [documentation](https://www.bugsplat.com/docs/sdk/electron/) on our website or email support(at)bugsplat.com if you have any questions.

Good luck!
© BugSplat Software
[Web](https://www.bugsplat.com) | [Twitter](https://twitter.com/BugSplatCo) | [Facebook](https://www.facebook.com/bugsplatsoftware/)
