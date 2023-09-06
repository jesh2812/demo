import React from "react";
import { useSelector, useDispatch } from "react-redux";

export default () => {
  const onDragStart = (event, nodeType, label, obj, obj_type) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("label", label);
    event.dataTransfer.setData("obj", obj);
    event.dataTransfer.setData("obj_type", obj_type);
  };

  const resourceNodes = useSelector(state => state.resourceNodes);
  const moduleNodes = useSelector(state => state.moduleNodes);

  return (
    <aside>
      <div className="description">
        You can drag these nodes to the pane on the right.
      </div>
      {resourceNodes.map((ele) => {
        if (!ele.data.is_displayed) {
          return (
            <div
              className="dndnode input"
              onDragStart={(event) =>
                onDragStart(
                  event,
                  "default",
                  ele.data.label,
                  ele.data.obj,
                  "Resource"
                )
              }
              draggable
            >
              {ele.data.label}
            </div>
          );
        }
      })}
      {moduleNodes.map((ele) => {
        if (!ele.data.is_displayed) {
          return (
            <div
              className="dndnode input"
              onDragStart={(event) =>
                onDragStart(
                  event,
                  "default",
                  ele.data.label,
                  ele.data.obj,
                  "Module"
                )
              }
              draggable
            >
              {ele.data.label}
            </div>
          );
        }
      })}
    </aside>
  );
};
