import { useEffect } from "react";
import { useAlchemy } from '@/hooks/useAlchemy';

export function useBlock() {
  const { alchemy, data, setData, setBlockData } = useAlchemy();

  async function setBlock(blockNum) {
    const block = await alchemy.core.getBlock(blockNum);
    setBlockData(block);
  }

  async function fetchInitalBlocks() {
    const numOfBlocksToRead = 10;
    const currentBlock = await alchemy.core.getBlockNumber();
    const blocksRequest = new Array(numOfBlocksToRead).fill(currentBlock)
      .map((v, i) => alchemy.core.getBlock(v - i));

    const blocks = await Promise.all(blocksRequest);
    setData(blocks);
  }

  useEffect(() => {
    fetchInitalBlocks();
  }, []);

  useEffect(() => {
    alchemy.ws.on("block", 
      (blockNum) => setBlock(blockNum)
    );
  }, []);

  return { data };
};
