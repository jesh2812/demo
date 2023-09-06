
import { useRef, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateEdge, addEdge, useNodesState, useEdgesState } from "reactflow";
import { actions } from "../utils/dataCenter";


const useResourceNode = () => {
  const dispatch = useDispatch();
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodeData, setNodeData] = useState({});
  const [isDeleteOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [nodeDisplay, setNodeDisplay] = useState(false);
  const [currNodeSelected, setCurrNodeSelected] = useState("");
  const resourceNodes = useSelector(state => state.datacenter.resourceNodes)
  console.log(nodes,"nodes")
  const createWorkflow = () => {
    console.log("Work flow");
  };

  const handleMouseEnter = (e, node) => {
    setNodeData(node);
  };

  const deleteNode = () => {
    const objectName = nodeData.data.obj
    setCurrNodeSelected("");
    dispatch(actions.deleteResourse([nodeData.id]));
    dispatch(actions.deleteResourceFromBody([nodeData.id]));
    dispatch(actions.deleteResourseNode([nodeData.id]));
    setNodes((elements) =>
      elements.filter((element) => element.id !== nodeData.id)
    );
    dispatch(actions.deleteImportant(objectName))
    setIsOpen(false);
  };

  const onConnect = useCallback((params) => {
    createWorkflow();
    return setEdges((eds) => addEdge({ ...params, animated: true }, eds));
  }, []);

  const onDragOver = useCallback((event) => {
    console.log("Dragged", event);
    console.log("kkkkk")
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onNodeClick = useCallback((event) => {
    const node_name_arr = event.target.innerText.split("-");
    if(node_name_arr.length > 1){
      const objName = node_name_arr[1].replace(" ", "");
      dispatch(actions.setCurrenNodeActivetData([objName]));
      dispatch(actions.updateSelectedNode(objName))
      setNodeDisplay(true);
      setCurrNodeSelected(objName);
    }
  });

  const onContextMenu = (e) => {
    e.preventDefault();
    const reactFlowWrapperBounds =
      reactFlowWrapper.current.getBoundingClientRect();
    const position = {
      x: e.clientX - reactFlowWrapperBounds.left + e.nativeEvent.offsetX,
      y: e.clientY - reactFlowWrapperBounds.top + e.nativeEvent.offsetY,
    };

    setPosition(position);
    setIsOpen(true);
  };

  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) =>{
      
      return setEdges((els) => updateEdge(oldEdge, newConnection, els));
    } 
      ,
    []
  );

  const addNode = useCallback((node) => {
    setNodes((nodes) => [...nodes, node]);
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");
      const label = event.dataTransfer.getData("label");
      const obj_1 = event.dataTransfer.getData("obj");
      const obj_type = event.dataTransfer.getData("obj_type");
      console.log(obj_type);

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      let newNode;

      if(obj_type==="Module"){
        newNode = {
            id: obj_1,
            type,
            position,
            data: { label: `${label}` },
          };
    
          dispatch(actions.updateModuleNode(obj_1));
      }
      else{
        newNode = {
            id: obj_1,
            type,
            position,
            data: { label: `${label}` },
          };
    
          dispatch(actions.updateResourceNode([obj_1]));
      }
      
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  // const onNodeDrag = useCallback((event, node)=>{
  //   console.log(node,"node")
  //   const node_text = node.data.label;
  //   const node_arr = node_text.split("-");
  //   const position = node.position;

  //   if(node_arr.length == 1){
  //     dispatch(actions.updateModuleNodePosition([node_text,position]));
  //   }
  //   else{
  //     const id = node_arr[1].trim();
  //     dispatch(actions.updateResourceNodePosition([id, position]));
  //   }

  // },[reactFlowInstance]);

  const onNodeDrag = useCallback(
        (event, node) => {
          const node_text = node.data.label;
          // code added by jesh for features
          const node_arr =
            node_text.toLowerCase() === "features"
              ? [null, "features"]
              : node_text.split("-");
    
          const position = node.position;
    
          if (node_arr.length == 1) {
            dispatch(actions.updateModuleNodePosition([node_text, position]));
          } else {
            const id = node_arr[1].trim();
            dispatch(actions.updateResourceNodePosition([id, position]));
          }
        },
        [reactFlowInstance]
      );

  return {
    reactFlowWrapper,
    nodes,
    setNodes,
    edges,
    setEdges,
    reactFlowInstance,
    setReactFlowInstance,
    nodeData,
    setNodeData,
    isDeleteOpen,
    setIsOpen,
    position,
    setPosition,
    nodeDisplay,
    setNodeDisplay,
    currNodeSelected,
    setCurrNodeSelected,
    onConnect,
    handleMouseEnter,
    deleteNode,
    onDragOver,
    onNodeClick,
    onContextMenu,
    onEdgeUpdate,
    addNode,
    onNodesChange,
    onEdgesChange,
    onDrop,
    onNodeDrag
  };
};

export default useResourceNode;
