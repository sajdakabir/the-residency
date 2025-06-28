import { ethers } from 'ethers';
import dotenv from 'dotenv';
import Residency from '../models/Residency.js';
import User from '../models/User.js';

dotenv.config();

// Configuration
const CONTRACT_ADDRESS = process.env.ERESIDENCY_NFT_CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
const RPC_URL = process.env.POLYGON_RPC_URL || 'https://polygon-amoy.g.alchemy.com/v2/03HS00LLlaFH3bVKly11J';
const METADATA_BASE_URI = process.env.METADATA_BASE_URI || 'https://api.eresidency.example.com/metadata';

// Validate required environment variables
if (!CONTRACT_ADDRESS) {
  throw new Error('ERESIDENCY_NFT_CONTRACT_ADDRESS is not defined in environment variables');
}
if (!PRIVATE_KEY) {
  throw new Error('WALLET_PRIVATE_KEY is not defined in environment variables');
}

// Initialize provider and signer with error handling
let provider;
let wallet;

try {
  provider = new ethers.JsonRpcProvider(RPC_URL);
  wallet = new ethers.Wallet(PRIVATE_KEY, provider);
} catch (error) {
  console.error('Failed to initialize Ethereum provider/wallet:', error);
  throw new Error('Failed to initialize blockchain connection');
}

// Contract ABI - Should match your deployed contract
const contractABI = [
  // ERC721 Standard
  'function balanceOf(address owner) view returns (uint256)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function safeTransferFrom(address from, address to, uint256 tokenId)',
  'function transferFrom(address from, address to, uint256 tokenId)',
  'function approve(address to, uint256 tokenId)',
  'function getApproved(uint256 tokenId) view returns (address)',
  'function setApprovalForAll(address operator, bool _approved)',
  'function isApprovedForAll(address owner, address operator) view returns (bool)',
  'function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data)',
  
  // ERC721 Metadata
  'function name() view returns (string memory)',
  'function symbol() view returns (string memory)',
  'function tokenURI(uint256 tokenId) view returns (string memory)',
  
  // Custom Functions
  'function mintNFT(address to, string memory name, string memory citizenshipCountry, string memory eResidencyId, string memory tokenUri) external returns (uint256)'
];

export const checkMintStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const residency = await Residency.findOne({ user: userId });
    
    if (!residency) {
      return res.status(404).json({ 
        hasMinted: false,
        message: 'No residency NFT found for this user'
      });
    }
    
    res.json({
      hasMinted: true,
      tokenId: residency.tokenId,
      contractAddress: residency.contractAddress,
      transactionHash: residency.transactionHash,
      mintedAt: residency.createdAt,
      metadata: residency.metadata
    });
  } catch (error) {
    console.error('Error checking mint status:', error);
    res.status(500).json({ error: 'Failed to check mint status' });
  }
};

/**
 * @swagger
 * /api/residency/mint:
 *   post:
 *     summary: Mint a new e-Residency NFT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - walletAddress
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user requesting the mint
 *               walletAddress:
 *                 type: string
 *                 description: The Ethereum address where the NFT will be minted
 *     responses:
 *       200:
 *         description: NFT minted successfully
 *       400:
 *         description: Invalid request or NFT already minted
 *       403:
 *         description: KYC not approved
 *       500:
 *         description: Server error
 */
export const mintResidencyNFT = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { userId, walletAddress } = req.body;
    
    // Input validation
    if (!userId || !walletAddress) {
      await session.abortTransaction();
      return res.status(400).json({ 
        error: 'Missing required fields: userId and walletAddress are required' 
      });
    }
    
    // Validate Ethereum address
    if (!ethers.isAddress(walletAddress)) {
      await session.abortTransaction();
      return res.status(400).json({ 
        error: 'Invalid wallet address' 
      });
    }
    
    // Verify user exists and is KYC approved
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }
    
    if (user.kycStatus !== 'approved') {
      await session.abortTransaction();
      return res.status(403).json({ 
        error: 'KYC verification not approved' 
      });
    }
    
    // Check if already minted
    const existingResidency = await Residency.findOne({ user: userId }).session(session);
    if (existingResidency) {
      await session.abortTransaction();
      return res.status(400).json({ 
        error: 'NFT already minted for this user',
        tokenId: existingResidency.tokenId,
        transactionHash: existingResidency.transactionHash
      });
    }
    
    // Prepare metadata
    const eResidencyId = `ER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const metadata = {
      name: user.fullName,
      citizenshipCountry: user.nationality || 'Unknown',
      eResidencyId,
      timestamp: new Date().toISOString(),
      description: `e-Residency NFT for ${user.fullName}`,
      image: `${METADATA_BASE_URI}/images/${eResidencyId}.png`,
      attributes: [
        {
          trait_type: 'Citizenship',
          value: user.nationality || 'Unknown'
        },
        {
          display_type: 'date',
          trait_type: 'Issued On',
          value: Math.floor(Date.now() / 1000)
        }
      ]
    };
    
    try {
      // Connect to contract
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);
      
      // Call mint function
      const tokenUri = `${METADATA_BASE_URI}/${eResidencyId}`;
      const tx = await contract.mintNFT(
        walletAddress,
        metadata.name,
        metadata.citizenshipCountry,
        eResidencyId,
        tokenUri
      );
      
      const receipt = await tx.wait();
      
      // Parse token ID from transaction receipt
      let tokenId;
      try {
        const iface = new ethers.Interface(contractABI);
        const log = receipt.logs.find(
          log => log.address.toLowerCase() === CONTRACT_ADDRESS.toLowerCase()
        );
        
        if (log) {
          const parsedLog = iface.parseLog(log);
          tokenId = parsedLog.args.tokenId?.toString();
        }
      } catch (parseError) {
        console.error('Error parsing transaction receipt:', parseError);
        // Fallback to block number if we can't parse the token ID
        tokenId = `tx-${receipt.blockNumber}-${receipt.transactionIndex}`;
      }
    
      // Save to database
      const newResidency = new Residency({
        user: userId,
        walletAddress: walletAddress.toLowerCase(),
        tokenId: tokenId.toString(),
        contractAddress: CONTRACT_ADDRESS,
        transactionHash: receipt.transactionHash,
        metadata,
        blockNumber: receipt.blockNumber,
        blockHash: receipt.blockHash
      });
      
      await newResidency.save({ session });
      
      // Update user with residency ID
      user.residencyId = eResidencyId;
      user.walletAddress = walletAddress.toLowerCase();
      user.nftTokenId = tokenId.toString();
      await user.save({ session });
      
      // Commit the transaction
      await session.commitTransaction();
      
      // Send response
      res.json({
        success: true,
        transactionHash: receipt.transactionHash,
        tokenId: tokenId.toString(),
        eResidencyId,
        contractAddress: CONTRACT_ADDRESS,
        blockNumber: receipt.blockNumber,
        timestamp: new Date().toISOString()
      });
      
    } catch (blockchainError) {
      await session.abortTransaction();
      console.error('Blockchain transaction failed:', blockchainError);
      throw new Error(`Blockchain transaction failed: ${blockchainError.message}`);
    }
    
  } catch (error) {
    try {
      await session.abortTransaction();
    } catch (abortError) {
      console.error('Error aborting transaction:', abortError);
    }
    
    console.error('Error in mintResidencyNFT:', error);
    
    // More specific error handling
    if (error.code === 'INSUFFICIENT_FUNDS') {
      return res.status(400).json({
        error: 'Insufficient funds for transaction',
        code: 'INSUFFICIENT_FUNDS'
      });
    }
    
    if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT') {
      return res.status(503).json({
        error: 'Blockchain network error. Please try again later.',
        code: 'NETWORK_ERROR'
      });
    }
    
    // Default error response
    res.status(500).json({ 
      error: 'Failed to mint NFT',
      code: 'MINT_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    await session.endSession();
  }
};
