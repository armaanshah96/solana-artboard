# buildspace Solana GIF Portal Project

### **Welcome 👋**
To get started with this course, clone this repo and follow these commands:

1. Run `npm install` at the root of your directory
2. Run `npm run start` to start the project
3. Start coding!

### **What is the .vscode Folder?**
If you use VSCode to build your app, we included a list of suggested extensions that will help you build this project! Once you open this project in VSCode, you will see a popup asking if you want to download the recommended extensions :).



### **Questions?**
Have some questions make sure you head over to your [buildspace Dashboard](https://app.buildspace.so/courses/CObd6d35ce-3394-4bd8-977e-cbee82ae07a3) and link your Discord account so you can get access to helpful channels and your instructor!


### Notes For Deploying with Anchor/Solana
* `solana config set --url devnet`
* `solana config get` # to confirm
* `anchor build`
* `solana address -k target/deploy/<project-name>-keypair.json`
* `anchor build`

Make sure to use the address in both `Anchor.toml` and in `lib.rs` as well as update `Anchor.toml` to use `devnet`