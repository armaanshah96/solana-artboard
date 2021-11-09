const anchor = require("@project-serum/anchor");

const { SystemProgram } = anchor.web3;

const main = async () => {
  console.log("🧲 Start test....");

  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Artboard;

  const baseAccount = anchor.web3.Keypair.generate();

  let tx = await program.rpc.start({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });

  console.log("⚙️ Your transaction signature:", tx);

  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log("🔎 Image count", account.totalImages.toString());

  await program.rpc.addImage(
    "https://cdn.hopculture.com/wp-content/uploads/2020/04/tavour-bestbeer-LEAD.jpg",
    {
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    }
  );

  // "https://cdn.hopculture.com/wp-content/uploads/2020/11/shacksbury-loball3.jpg",
  // "https://cdn.hopculture.com/wp-content/uploads/2020/01/HOLLYWOODACID-scaled.jpeg",
  // "https://cdn.hopculture.com/wp-content/uploads/2020/12/oozlefinch-the-thirsty-caterpillar-giveaway3.jpg",
  // "https://cdn.hopculture.com/wp-content/uploads/2020/12/outerrange-upcountry.jpg",

  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log("🔎 Image count", account.totalImages.toString());
  console.log("🔎 Image list", account.imageList);
};

const runMain = () => {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
};

runMain();
