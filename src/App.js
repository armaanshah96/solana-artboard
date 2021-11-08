import { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  const TEST_DATA = [
    "https://cdn.hopculture.com/wp-content/uploads/2020/04/tavour-bestbeer-LEAD.jpg",
    "https://cdn.hopculture.com/wp-content/uploads/2020/11/shacksbury-loball3.jpg",
    "https://cdn.hopculture.com/wp-content/uploads/2020/01/HOLLYWOODACID-scaled.jpeg",
    "https://cdn.hopculture.com/wp-content/uploads/2020/12/oozlefinch-the-thirsty-caterpillar-giveaway3.jpg",
    "https://cdn.hopculture.com/wp-content/uploads/2020/12/outerrange-upcountry.jpg",
  ];
  const [walletAddress, setWalletAddress] = useState(null);

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

  const renderConnectToWalletButton = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );
  useEffect(() => {
    window.addEventListener(
      "load",
      async () => await checkIfWalletIsConnected()
    );
  }, []);

  return (
    <div className="App">
      <div className={walletAddress ? "authed-container" : "container"}>
          <div className="header-container">
            <p className="header">🖍 Art Reference Board</p>
            <p className="sub-text">
              Your art collection for inspo
            </p>
            {!walletAddress && renderConnectToWalletButton()}
          </div>
          <div className="footer-container">
            <img
              alt="Twitter Logo"
              className="twitter-logo"
              src={twitterLogo}
            />
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
