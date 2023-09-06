import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  moduleNodes: [],
};
const moduleSlice = createSlice({
  name: "module",
  initialState: initialState,
  reducers: {
    addToModuleNodes(state, action) {
      const data = state.moduleNodes;
      let flag = false;
      for (const i of data) {
        if (i.id === action.payload) {
          flag = true;
        }
      }

      if (!flag) {
        data.push({
          id: action.payload,
          type: "default",
          data: {
            label: `${action.payload}`,
            obj: action.payload,
            is_displayed: false,
          },
          position: { x: 250, y: 5 },
        });
      }
      state.moduleNodes = data;
    },

    updateModuleNode(state, action) {
      const data = state.moduleNodes;
      for (const i of data) {
        if (i.data.obj == action.payload) {
          //console.log(current(action.payload[1]))
          //i.position = action.payload[1]
          i.data.is_displayed = !i.data.is_displayed;
        }
      }

      state.moduleNodes = data;
    },
  },
});

export default moduleSlice;