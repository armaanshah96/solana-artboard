import { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_DATA = [
  "https://cdn.hopculture.com/wp-content/uploads/2020/04/tavour-bestbeer-LEAD.jpg",
  "https://cdn.hopculture.com/wp-content/uploads/2020/11/shacksbury-loball3.jpg",
  "https://cdn.hopculture.com/wp-content/uploads/2020/01/HOLLYWOODACID-scaled.jpeg",
  "https://cdn.hopculture.com/wp-content/uploads/2020/12/oozlefinch-the-thirsty-caterpillar-giveaway3.jpg",
  "https://cdn.hopculture.com/wp-content/uploads/2020/12/outerrange-upcountry.jpg",
];

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

  const sendArtUrl = () => {
    if (inputValue.length > 0) {
      console.log("Sending value:", inputValue);
    } else {
      console.log("Input value is empty");
    }
  };

  const onInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const renderConnectToWalletButton = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  const renderConnectedContainer = () => (
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
        {images.map((url) => {
          return (
            <div className="gif-item" key={url}>
              <img src={url} alt={url} />
            </div>
          );
        })}
      </div>
    </div>
  );

  useEffect(() => {
    window.addEventListener(
      "load",
      async () => await checkIfWalletIsConnected()
    );
  }, []);

  useEffect(() => {
    if (walletAddress) {
      setImages(TEST_DATA);
    }
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
