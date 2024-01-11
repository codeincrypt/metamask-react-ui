import "./App.css";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import web3 from "web3"
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

  const handleLogin = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log("MetaMask Here!");

      const message = [
        "This site is requesting your signature to approve login authorization!",
        "I have read and accept the terms and conditions (https://trade.paybito.com/nft-marketplace) of this app.",
        "Please sign me in!"
      ].join("\n\n")

      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];

        const sign = await window.ethereum.request({ method: 'personal_sign', params: [message, account] })
        console.log('sign', sign)
        setLogged(true);
        setAccount(account);
        localStorage.setItem("metamask", sign)
        setProvider(new ethers.providers.Web3Provider(window.ethereum));
      } catch (error) {
        console.log('error in sign request', error)
        if (error.code === 4001) {
          alert(error.message)
        }
      }
    } else {
      console.log("Need to install MetaMask");
      onboarding.startOnboarding();
    }
  };

  const getAccounts = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    setLogged(true);
    setAccount(account);
    setProvider(new ethers.providers.Web3Provider(window.ethereum));
  }

  // const handleLogin = () => {
  //   if (window.ethereum && window.ethereum.isMetaMask) {
  //     console.log("MetaMask Here!");
  //     window.ethereum
  //       .request({ method: "eth_requestAccounts" })
  //       .then((result) => {
  //         console.log(result);
  //         setLogged(true);
  //         setAccount(utils.getAddress(result[0]));
  //         setProvider(new ethers.providers.Web3Provider(window.ethereum));
  //       })
  //       .catch((error) => {
  //         console.log("Could not detect Account");
  //       });
  //   } else {
  //     console.log("Need to install MetaMask");
  //     onboarding.startOnboarding();
  //   }
  // };
  const hnadleLogout = () => {
    localStorage.removeItem("metamask")
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

  const ABI = [{ "inputs": [{ "internalType": "address", "name": "initialOwner", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "ERC721EnumerableForbiddenBatchMint", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "address", "name": "owner", "type": "address" }], "name": "ERC721IncorrectOwner", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "ERC721InsufficientApproval", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "approver", "type": "address" }], "name": "ERC721InvalidApprover", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }], "name": "ERC721InvalidOperator", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "ERC721InvalidOwner", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "receiver", "type": "address" }], "name": "ERC721InvalidReceiver", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }], "name": "ERC721InvalidSender", "type": "error" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "ERC721NonexistentToken", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "ERC721OutOfBoundsIndex", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "OwnableInvalidOwner", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "OwnableUnauthorizedAccount", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "approved", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "_fromTokenId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "_toTokenId", "type": "uint256" }], "name": "BatchMetadataUpdate", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "_tokenId", "type": "uint256" }], "name": "MetadataUpdate", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "getApproved", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" }], "name": "isApprovedForAll", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "ownerOf", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "string", "name": "uri", "type": "string" }], "name": "safeMint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "tokenByIndex", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "tokenOfOwnerByIndex", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "tokenURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]

  // const web3  = new Web3("https://rpc.ankr.com/eth_sepolia")
  const CONTRACT_ADDRESS = "0x37d58e4090bcea55455bad5077bedd033afbf1c1"

  const getToken = async () => {
    try {
      const Web3 = new web3(window.ethereum);
      var token = new Web3.eth.Contract(ABI, CONTRACT_ADDRESS);
      token = token.methods
      console.log('token', token);
      // let tokenname = await myContract.methods.name().call()
      // console.log('tokenname', tokenname);
      let owner = await token.owner().call()
      console.log('owner', owner);
      // console.log('getToken', myContract.methods)

        // const token = await ethers.getContractAt(ABI, tokenAddress, ethers.provider);

        console.error(await token.name(), 'tokens owned by', owner);
        const sentLogs = await token.queryFilter(
          token.filters.Transfer(owner, null),
        );

        const receivedLogs = await token.queryFilter(
          token.filters.Transfer(null, owner),
        );

        const logs = sentLogs.concat(receivedLogs).sort((a, b) =>
            a.blockNumber - b.blockNumber ||
            a.transactionIndex - b.TransactionIndex,
        );
      
        const owned = new Set();
      
        for (const log of logs) {
          const { from, to, tokenId } = log.args;
          console.log('log.args', log.args);
          owned.add(tokenId.toString());
          // if (addressEqual(to, account)) {
          //   owned.add(tokenId.toString());
          // } else if (addressEqual(from, account)) {
          //   owned.delete(tokenId.toString());
          // }
        }
        console.log([...owned].join('\n'));
    } catch (error) {
      console.log('Error', error)
    }
  }

  const getTokens = async () => {
    const getIntFromHexBignumber = (hexBigNumber) => parseInt(Number(hexBigNumber._hex), 10);

    const Web3 = new web3(window.ethereum);
    var token = new Web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    token = token.methods
    
    console.log('address', account);
    try {
      const totalNFTs = await token.balanceOf(account);
      console.log('totalNFTs', totalNFTs)
      const parsedTotalNFTs = getIntFromHexBignumber(totalNFTs);
      let i = 0;
      const nfts = [];
    
      while (i < parsedTotalNFTs) {
        nfts.push(token.tokenByIndex(i));
        i += 1;
      }
    
      const promiseResult = await Promise.all(nfts);
    
      const results = [];
    
      promiseResult.forEach((result) => {
        results.push(getIntFromHexBignumber(result));
      });
      console.log('results', results)
    } catch (error) {
      console.log('error', error)
    }

  };

  const sendNftToken = async () => {
    // const contract = new window.ethereum.Contract(CONTRACT_ADDRESS)
    let tokenId = 21
    let transferToAddress = "0x04fAD8A0fE941994c72058989B203B4f3cFB0321"
    if (tokenId === "") {
      return alert("please provide tokenId")
    }
    if (transferToAddress === "") {
      return alert("please provide receiver address")
    }

    //Calling the metamask plugin
    const Web3 = new web3(window.ethereum);
    var myContract = new Web3.eth.Contract(ABI, CONTRACT_ADDRESS, { from: account });
    myContract.methods.transferFrom(account, transferToAddress, tokenId).send({ from: account, gas: 300000 })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log("Error in send NFT Token", error);
      })
  }

  useEffect(() => {
    if (localStorage.getItem("metamask")) {
      getAccounts()
    }
  }, [])

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

                    <div className="text-center">
                      <button className="btn btn-danger mr-3">Copy Address</button>
                      <button className="btn btn-danger mr-3">Copy to clipboard</button>
                    </div>

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
                    <button onClick={getToken} className="">Get Token  </button>
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