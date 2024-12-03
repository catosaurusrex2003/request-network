import React, { useState } from "react";

// components

import CardTable from "components/Cards/CardTable.js";
import CardSettings from "components/Cards/CardSettings";

export default function Tables() {
  const [reciepentList, setReciepentList] = useState([])
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardTable />
        </div>
        <CardSettings />
      </div>
    </>
  );
}
