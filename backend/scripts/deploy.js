const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting contract deployment...");
  
  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  // console.log("💰 Account balance:", hre.ethers.formatEther(await deployer.getBalance()), "ETH");

  // CORRECT: ethers v6 getBalance syntax
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy the contract
  const Counter = await hre.ethers.getContractFactory("Counter");
  console.log("📦 Deploying Counter contract...");
  
  const counter = await Counter.deploy();
  
  // Wait for deployment to complete (NEW in ethers v6)
  console.log("⏳ Waiting for deployment confirmation...");
  await counter.waitForDeployment();
  
  // Get the contract address (NEW in ethers v6)
  const contractAddress = await counter.getAddress();
  console.log("✅ Counter deployed to:", contractAddress);
  
  // Test the contract
  console.log("🧪 Testing contract functions...");
  const initialCount = await counter.getCount();
  console.log("   Initial count:", initialCount.toString());
  
  // Save contract address and ABI for frontend
  const contractInfo = {
    address: contractAddress,
    deployer: deployer.address,
    network: "localhost",
    timestamp: new Date().toISOString()
  };
  
  // Ensure frontend directory exists
  const frontendDir = path.join(__dirname, "../../frontend/src/app");
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }
  
  // Save contract address
  fs.writeFileSync(
    path.join(frontendDir, "contract-address.json"),
    JSON.stringify(contractInfo, null, 2)
  );
  
  // Save ABI
  const artifact = await hre.artifacts.readArtifact("Counter");
  fs.writeFileSync(
    path.join(frontendDir, "counter-abi.json"),
    JSON.stringify(artifact.abi, null, 2)
  );
  
  console.log("💾 Contract info saved to frontend!");
  console.log("📁 Address saved to:", path.join(frontendDir, "contract-address.json"));
  console.log("📁 ABI saved to:", path.join(frontendDir, "counter-abi.json"));
  
  // Verify files were created
  const addressFile = path.join(frontendDir, "contract-address.json");
  const abiFile = path.join(frontendDir, "counter-abi.json");
  
  if (fs.existsSync(addressFile) && fs.existsSync(abiFile)) {
    console.log("✅ Files verified successfully!");
  } else {
    console.log("❌ Error: Files were not created");
  }
}

// Handle errors
main()
  .then(() => {
    console.log("🎉 Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    if (error.reason) {
      console.error("Reason:", error.reason);
    }
    if (error.code) {
      console.error("Error code:", error.code);
    }
    process.exit(1);
  });