import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tables: {},
};

const tablesSlice = createSlice({
  name: "tablesSlice",
  initialState: initialState,
  reducers: {
    clearTablesState: () => initialState,

    initTableData(state,action){
      const objectName = action.payload
      const table = state.tables[objectName] || [];
      state.tables[objectName] = table;
    },

    addTableData(state, action) {
      const objectName = action.payload[0]
      const table = state.tables[objectName] || [];
      const isAdded = table.some((arg) => arg[1] == action.payload[1][1]);
      if (!isAdded) {
        table.push(action.payload[1]);
        state.tables[objectName] =  table;
      }
    },

    deleteFromTable(state, action) {
      const objectName = action.payload[0]
      const table = state.tables[objectName]
      //const filteredTable = table.filter((obj) => obj[1] !== action.payload[1]);
      if (table) {
        const filteredTable = table.filter(
          (obj) => obj[1] !== action.payload[1]
        );
        console.log(filteredTable,"shgdhs")

      state.tables[objectName] = filteredTable;
    }},
  },
});

export default tablesSlice;
