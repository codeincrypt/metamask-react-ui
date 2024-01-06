import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import MetaMaskOnboarding from "@metamask/onboarding";
import Logo from '../src/assets/1683020955metamask-icon-png.png'
function App() {
  // const [transfer, setTransfer] = useState({
  //   toAddress:"",
  //   value:""
  // })

  // TRANSFER
  const [transferToAddress, setTransferToAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [tokenId, setTransferTokenId] = useState('');

  const [logged, setLogged] = useState(false);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState();
  const forwarderOrigin = "http://localhost:3000";
  const onboarding = new MetaMaskOnboarding({ forwarderOrigin });
  const { utils } = require("ethers");
  const [provider, setProvider] = useState("");
  const [mess, setMessage] = useState();
  const [signature, setSignature] = useState();
  const [address, setAddress] = useState("");
  const [verifyAddress, setVerifyAddress] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");

  const handleLogin = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log("MetaMask Here!");
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          console.log(result);
          setLogged(true);
          setAccount(utils.getAddress(result[0]));
          setProvider(new ethers.providers.Web3Provider(window.ethereum));
        })
        .catch((error) => {
          console.log("Could not detect Account");
        });
    } else {
      console.log("Need to install MetaMask");
      onboarding.startOnboarding();
    }
  };
  const hnadleLogout = () => {
    setLogged(false);
    setAccount(null);
  };
  const handleBalance = () => {
    window.ethereum
      .request({ method: "eth_getBalance", params: [account, "latest"] })
      .then((balance) => {
        setBalance(ethers.utils.formatEther(balance));
      })
      .catch((error) => {
        console.log("Could not detect the Balance");
      });
  };
  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  const handleSign = async () => {
    const message = mess;
    const signer = await provider.getSigner();
    const signature = await signer.signMessage(message);
    const address = await signer.getAddress();
    setSignature(signature);
    setAddress(address);
    console.log("sig : " + signature);
  };
  const verify = () => {
    const actualAddress = utils.verifyMessage(mess, signature);
    console.log(actualAddress);
    setVerifyAddress(actualAddress);
    if (actualAddress !== address) {
      console.log("invalid");
      setVerificationStatus("False");
    } else {
      console.log("valid");
      setVerificationStatus("True");
    }
  };

  const sendEth = () => {
    if (transferAmount === '' || transferAmount === 0 || transferAmount === "0") {
      return alert("please provide amount")
    }
    if (transferToAddress === "") {
      return alert("please provide receiver address")
    }
    let amount = transferAmount
    let values = "0x" + Number(ethers.utils.parseEther(amount)).toString(16)
    window.ethereum
      .request({
        method: 'eth_sendTransaction',
        // The following sends an EIP-1559 transaction. Legacy transactions are also supported.
        params: [
          {
            from: account, // The user's active address.
            to: transferToAddress, // Required except during contract publications.
            value: values, // Only required to send ether to the recipient from the initiating external account.
            gasLimit: '0x5028', // Customizable by the user during MetaMask confirmation.
            maxPriorityFeePerGas: '0x3b9aca00', // Customizable by the user during MetaMask confirmation.
            maxFeePerGas: '0x2540be400', // Customizable by the user during MetaMask confirmation.
          },
        ],
      })
      .then((txHash) => console.log('txHash', txHash))
      .catch((error) => {
        console.error('error', error)
        if (error.code === 4001) {
          alert("User Rejected Transaction Request")
        }
      });
  }

  const sendNftToken = () => {
    const CONTRACT_ADDRESS = "0x37d58e4090bcea55455bad5077bedd033afbf1c1"
    // const contract = new window.ethereum.Contract(CONTRACT_ADDRESS)
    let tokenId = 21
    let transferToAddress = "0x04fAD8A0fE941994c72058989B203B4f3cFB0321"
    if (tokenId === "") {
      return alert("please provide tokenId")
    }
    if (transferToAddress === "") {
      return alert("please provide receiver address")
    }
    let values = "0x" + Number(tokenId).toString(16)
    console.log('values', values)
    window.ethereum.contract.methods
      .transferFrom(account, transferToAddress, values)
      .send({ from: account })
      .then((receipt) => {
        console.log('Transaction Receipt:', receipt);
      })
      .catch((error) => {
        console.error('Transaction Error:', error);
      });
  }


  return (
    <div>
      {!logged ? (
        <div className="App" style={{ marginTop: 100 }}>
          <div className="card cards text-center">
            <img src={Logo} />
            <h2 className="mb-4 text-dark text-center">Connect your Metamask wallet</h2>
            <button className="btn btn-dark w-100" onClick={handleLogin}>Connect Metamask</button>
          </div>
        </div>
      ) : (
        <div className="App" style={{ marginTop: 100 }}>
          <div className="container">
            <div className="row">
              <div className="col-lg-5">
                <div className="card bg-dark p-md-4 text-white">
                  <h4 className="text-white">Account</h4>
                  <div className="card bg-dark p-md-4">

                    <h4 className="text-white mb-md-5">{account}</h4>

                    <p className="text-small small">Copy Address</p>
                    <p className="text-small small">Copy to clipboard</p>
                  </div>
                </div>
                <button className="mt-md-3 btn btn-dark p-md-3" onClick={hnadleLogout}>Logout Metamask</button>
              </div>
              <div className="col-lg-7">
                <div className="card bg-dark p-md-4">
                  <div className="mb-md-4">
                    <h2>Balance is {balance}</h2>
                    <button onClick={handleBalance}>check Balance</button>
                  </div>
                  <hr />
                  {/* <div className="mb-md-4">
                    <input
                      type="text"
                      placeholder="message"
                      onChange={(e) => handleChange(e)}
                    />
                    <button onClick={() => handleSign()}>Sign</button>
                  <p>
                    <font size="5" color="red">
                      Message is : <br></br>
                      {mess}
                    </font>
                  </p>
                  <p>
                    <font size="5" color="black">
                      signature is : <br></br>
                      {signature}
                    </font>
                  </p>
                  <p>
                    <font size="5" color="green">
                      address is : <br></br>
                      {address}
                    </font>
                  </p>
                </div> */}
                  {/* <div className="mb-md-4">
                  <br></br>
                  <button onClick={verify}>Verify</button>
                  <p>
                    <font size="5" color="purple">
                      verification : <br></br>
                      {verificationStatus}
                    </font>
                  </p>
                  <p>
                    <font size="5" color="blue">
                      verification address is : <br></br>
                      {verifyAddress}
                    </font>
                  </p>

                </div> */}

                  <div className="mb-md-4">
                    <h2>ETH Transfer</h2>
                    <input
                      type="text"
                      placeholder="toAddress"
                      onChange={(e) => setTransferToAddress(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="value"
                      onChange={(e) => setTransferAmount(e.target.value)}
                    />
                    <button onClick={sendEth} className="">Send ETH  </button>
                  </div>

                  <div className="mb-md-4">
                    <h2>SEND NFT</h2>
                    <input
                      type="text"
                      placeholder="toAddress"
                      value="0x04fAD8A0fE941994c72058989B203B4f3cFB0321"
                      onChange={(e) => setTransferToAddress(e.target.value)}
                    />
                    <input
                      type="text"
                      value="21"
                      placeholder="tokenId"
                      onChange={(e) => setTransferTokenId(e.target.value)}
                    />
                    <button onClick={sendNftToken} className="">Transfer NFT  </button>
                  </div>


                </div>
              </div>
            </div>



          </div>
        </div>

      )
      }
    </div >
  );
}
export default App;