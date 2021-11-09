import { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import idl from "./idl.json";
import kp from "./keypair.json";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
import "./App.css";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const { SystemProgram } = web3;
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
let baseAccount = web3.Keypair.fromSecretKey(secret);

const programId = new PublicKey(idl.metadata.address);
const network = clusterApiUrl("devnet");
const opts = { preflightCommitment: "processed" };

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [images, setImages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { solana } = window;
    try {
      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet detected!");
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            "Connected with public key",
            response.publicKey.toString()
          );

          setWalletAddress(response.publicKey.toString());
        }
      } else {
        console.log("Solana obj not found, install a phantom 👻  wallet");
      }
    } catch (e) {
      console.log(
        "Unable to detect solana object with phantom because of error: ",
        e
      );
    }
  };

  const connectWallet = async () => {
    const { solana } = window;
    try {
      const response = await solana.connect();

      setWalletAddress(response.publicKey.toString());
    } catch (e) {
      console.log(
        "Unable to detect solana object with phantom because of error: ",
        e
      );
    }
  };

  const sendArtUrl = async () => {
    if (inputValue.length === 0) {
      console.log("Input value is empty");
      return;
    }
    console.log("Sending value:", inputValue);

    try {
      const provider = getProvider();
      const program = new Program(idl, programId, provider);

      await program.rpc.addImage(inputValue, {
        accounts: {
          baseAccount: baseAccount.publicKey,
        }
      });
      
      console.log("Sent image successfully!");
      await fetchImages();
    } catch (error) {
      console.log("Error sending image", error);
    }
  };

  const onInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    return provider;
  };

  const createImageAccount = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programId, provider);

      await program.rpc.start({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
      });
      console.log(
        "Created new Base account w address:",
        baseAccount.publicKey.toString()
      );
      await fetchImages();
    } catch (error) {
      console.log("Error happened creating image account", error);
    }
  };

  const renderConnectToWalletButton = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  const renderConnectedContainer = () => {
    if (images === null) {
      return (
        <div className="connected-container">
          <button
            className="cta-button submit-gif-button"
            onClick={createImageAccount}
          >
            Do One-time initialization for Artboard program account
          </button>
        </div>
      );
    }

    return (
      <div className="connected-container">
        <input
          type="text"
          placeholder="add to the mood board"
          value={inputValue}
          onChange={onInputChange}
        />
        <button className="cta-button submit-gif-button" onClick={sendArtUrl}>
          Submit
        </button>
        <div className="gif-grid">
          {images.map((item, index) => {
            return (
              <div className="gif-item" key={index}>
                <img src={item.imageUrl} alt={item.imageUrl} />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const fetchImages = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programId, provider);
      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );

      console.log("got the account", account);
      setImages(account.imageList);
    } catch (error) {
      console.timeLog("Error in fetching images!: ", error);
      setImages(null);
    }
  };

  useEffect(() => {
    window.addEventListener(
      "load",
      async () => await checkIfWalletIsConnected()
    );
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log("fetching images");
      fetchImages();
    }
  // eslint-disable-next-line
  }, [walletAddress]);

  return (
    <div className="App">
      <div className={walletAddress ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">🖍 Art Reference Board</p>
          <p className="sub-text">Your art collection for inspo</p>
          {walletAddress
            ? renderConnectedContainer()
            : renderConnectToWalletButton()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
