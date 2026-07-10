import React, { useState } from "react";
import AddInstruction from "./TiffinRightPanle/DataManagementComponents/AddInstruction";
import ManageTiffin from "./TiffinRightPanle/DataManagementComponents/ManageTiffin";
import ShowComments from "./TiffinRightPanle/DataManagementComponents/ShowComments";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { authContext } from "../../../../context";

const RenderSelectedComponet = ({
  selectedMealType,
  SelectedInstruction,
  SelectedComponet,
}) => {
  // const location = useLocation(); // React Hook
  // let [userLocation, setUserLocation] = useState();
  // const { user } = useContext(authContext);
  // console.log(user);

  if (SelectedComponet) {
    switch (SelectedComponet) {
      case "Manage-Tiffin":
        return <ManageTiffin />;
      case "Reviews":
        return <ShowComments />;
      case "Instructions":
        return <AddInstruction />;
      default:
        return <ManageTiffin />;
    }
  }

  return (
    <div className="w-full">
      {SelectedComponet && <div>{SelectedComponet}</div>}
    </div>
  );
};

export default RenderSelectedComponet;
