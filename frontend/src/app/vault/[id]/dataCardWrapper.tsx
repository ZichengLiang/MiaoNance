import React, { Children, ReactNode } from "react";
import DataCard from "./dataCard";
import { range } from "@/utils/range";
import { randomUUID } from "crypto";

interface DataCardWrapperProps {
  children?: ReactNode; // Each child is assumed to be a Card component
}

export default function DataCardWrapper({ children }: DataCardWrapperProps) {
  const sampleArr = range(1, 5);
  const cardCount = children ? Children.count(children) : sampleArr.length;
  console.log(`card count: `, cardCount);
  const numCols = cardCount <= 2 ? 1 : 2;
  console.log(`#cols`, numCols);
  const numRows = cardCount === 2 ? 2 : Math.ceil(cardCount / 2);
  console.log(`#rows`, numRows);
  const lastItem = (num: number, cardCount: number) =>
    num === cardCount && cardCount % 2 != 0;
  return (
    <div className="w-full gap-y-4">
      <br />
      <header className={`h-[5vh] border rounded-lg p-2 text-center`}>
        <p className="font-bold">The control bar</p>
      </header>
      <br />
      <div
        className={`h-[75vh] auto-rows-fr grid grid-cols-${numCols} grid-rows-${numRows} flex justify-between gap-4 overflow-auto`}
      >
        {sampleArr.map((num) => (
          <DataCard
            key={randomUUID()}
            id={num}
            className={lastItem(num, cardCount) ? `col-span-2` : ``}
          />
        ))}
      </div>
    </div>
  );
}
