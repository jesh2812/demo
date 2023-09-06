/* import { configureStore } from "@reduxjs/toolkit";
import moduleSlice from "../slice/moduleSlice/moduleSlice";
import templateDataSlice from "../slice/templateSlice";

const store = configureStore({
  reducer: {
    moduleSlice: moduleSlice.reducer,
    template: templateDataSlice.reducer,
  },
});

export const { addToModuleNodes, updateModuleNode } = moduleSlice.actions;
export const {
  updateValidation,
  updateProvider,
  updateTemplateName,
  updateObjectName,
  updateResourceName,
} = templateDataSlice.actions;

export default store;
 */