// scripts/deploy.js (纯 ESM 现代语法版)
import hre from "hardhat";

async function main() {
  console.log("⏳ 正在编译并准备部署 KnowledgeRegistry 合约...");

  // 获取合约工厂
  const KnowledgeRegistry = await hre.ethers.getContractFactory("KnowledgeRegistry");
  
  // 部署合约
  const registry = await KnowledgeRegistry.deploy();

  // 等待部署完成
  await registry.waitForDeployment();

  // 获取部署后的合约地址
  const contractAddress = await registry.getAddress();

  console.log(`\n🎉 太棒了！合约已成功部署到本地私链！`);
  console.log(`📜 合约地址: ${contractAddress}`);
  console.log(`✍️ 部署者(也就是平台官方钱包): ${registry.deploymentTransaction().from}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});