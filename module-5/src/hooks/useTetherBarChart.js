import { useEffect } from "react";
import { AssetTransfersCategory } from "alchemy-sdk";
import { useAlchemy } from '@/hooks/useAlchemy';

const tetherAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

export const useTetherBarChart = () => {
  const { alchemy, data, setData, setBlockData } = useAlchemy();

  async function fetchInitalTransfers() {
    const numOfBlocksToRead = 10;
    const currentBlock = await alchemy.core.getBlockNumber();
    const transfers = await _getBlockAssetTransfers(
      currentBlock - numOfBlocksToRead,
      currentBlock
    );

    let arr = [];
    let block = {
      blockNum: 0,
      transactionSum: 0,
    };

    for (const transfer of transfers) {
      if (block.blockNum !== Number(transfer.blockNum)) {
        block.blockNum !== 0 && arr.push(block);
        block = {
          blockNum: Number(transfer.blockNum),
          transactionSum: 0,
        };
      }

      block.transactionSum += transfer.value;
    }

    setData(arr);
  }

  async function fetchTransfers(currentBlock) {
    const transfers = await _getBlockAssetTransfers(currentBlock, currentBlock);

    let block = {
      blockNum: 0,
      transactionSum: 0,
    };

    if (transfers.length > 0) {
      for (const transfer of transfers) {
        if (block.blockNum !== Number(transfer.blockNum)) {
          block = {
            blockNum: Number(transfer.blockNum),
            transactionSum: 0,
          };
        }

        block.transactionSum += transfer.value;
      }
    } else {
      block.blockNum = currentBlock;
    }

    setBlockData(block);
  }

  async function _getBlockAssetTransfers(fromBlock, toBlock) {
    const { transfers } = await alchemy.core.getAssetTransfers({
      fromBlock,
      toBlock,
      contractAddresses: [tetherAddress],
      excludeZeroValue: true,
      order: "desc",
      category: [AssetTransfersCategory.ERC20],
    });

    return transfers;
  }

  useEffect(() => {
    fetchInitalTransfers();
  }, []);

  useEffect(() => {
    alchemy.ws.on("block", 
      (blockNum) => fetchTransfers(blockNum)
    );
  }, []);

  return { data };
};
