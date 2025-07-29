import React, { Children, ReactNode } from "react";
import DataCard from "./dataCard";
import { range } from "@/utils/range";
import { randomUUID } from "crypto";

interface DataCardWrapperProps {
  children?: ReactNode; // Each child is assumed to be a Card component
}

export default function DataCardWrapper({ children }: DataCardWrapperProps) {
  const sampleArr = range(1, 4);

  const cardCount = children ? Children.count(children) : sampleArr.length;
  console.log(`card count: `, cardCount);
  const numCols = cardCount <= 2 ? 1 : 2;
  console.log(`#cols`, numCols);
  const numRows = cardCount === 2 ? 2 : Math.ceil(cardCount / 2);
  console.log(`#rows`, numRows);
  const lastOddItem = (num: number, cardCount: number) =>
    num === cardCount && cardCount % 2 === 1;

  return (
    <div className="w-full">
      <br />
      <header className={`h-[5vh] border rounded-lg p-2 text-center`}>
        <p className="font-bold">The control bar</p>
      </header>
      <br />
      <div
        className={`h-[75vh] w-full grid grid-cols-${numCols} grid-rows-${numRows} flex gap-4`}
      >
        {sampleArr.map((num) => (
          <DataCard
            key={randomUUID()}
            id={num}
            className={lastOddItem(num, cardCount) ? `col-span-2` : ``}
          />
        ))}
      </div>
    </div>
  );
}
