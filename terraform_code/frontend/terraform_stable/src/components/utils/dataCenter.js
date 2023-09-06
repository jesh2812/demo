import { configureStore } from "@reduxjs/toolkit";
import { createSlice, current } from "@reduxjs/toolkit";
import templateDataSlice from "../../slice/templateSlice";
import tablesSlice from "../../slice/tablesSlice";

const initialState = {
  data: [],
  resourse: [],
  important: [],
  deleteList: {},
  tableData: {},
  editData: {},
  hiding: [],
  editOutput: {},
  editVariables: {},
  existingVariables: [],
  attributes: {},
  attrDeleteList: {},
  editCustomData: [],
  customCodeData: [],
  customCodeResourceStatus: [],
  resourceNodes: [],
  selectedNode: "",
  currentNodeActive: [],
  moduleNodes: [],
};

const dataSlicer = createSlice({
  name: "dataCenter",
  initialState,
  reducers: {
    clearState: () => initialState,

    deleteImportant(state, action){
      const important = state.important

      const filteredData = important.filter((ele)=>ele.object_name!==action.payload)
      state.important = filteredData
    },

    updateSelectedNode(state, action) {
      state.selectedNode = action.payload;
    },

    addToModuleNodes(state, action) {
      let data = state.moduleNodes;
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
      } else {
        data = data.filter((ele) => ele.id != action.payload);
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

    addToCustomModules(state, action) {
      const module_name = action.payload[0];
      const module_data = action.payload[1];

      state.customModules[module_name] = module_data;
    },

    setCurrenNodeActivetData(state, action) {
      const tables_data = state.resourse;
      const object_data = tables_data.filter(
        (ele) => ele[1][2] === action.payload[0]
      );

      state.currentNodeActive = object_data;
    },

    deleteResourceFromBody(state, action) {
      const data = state.data;

      state.data = data.filter((ele) => ele.object_name != action.payload[0]);
    },

    deleteResourseNode(state, action) {
      const data = state.resourceNodes;
      state.currentNodeActive = [];
      state.resourceNodes = data.filter((ele) => ele.id !== action.payload[0]);
    },

    updateModuleNodePosition(state, action) {
      const data = state.moduleNodes;
      const new_data = data.map((ele) => {
        return ele.id === action.payload[0]
          ? { ...ele, position: action.payload[1] }
          : ele;
      });

      state.moduleNodes = new_data;
    },

    updateResourceNodePosition(state, action) {
      const data = state.resourceNodes;
      const new_data = data.map((ele) => {
        return ele.id === action.payload[0]
          ? { ...ele, position: action.payload[1] }
          : ele;
      });

      state.resourceNodes = new_data;
    },

    addEditResourceNode(state, action) {
      const data = state.resourceNodes;
      //console.log(current(action.payload))
      data.push({
        id: action.payload[0],
        type: "default",
        data: {
          label: action.payload[2],
          obj: action.payload[1],
          is_displayed: action.payload[3],
        },
        position: { x: action.payload[4], y: action.payload[5] },
      });
      state.resourceNodes = data;
    },

    updateResourceNode(state, action) {
      const data = state.resourceNodes;
      for (const i of data) {
        if (i.data.obj == action.payload[0]) {
          //console.log(current(action.payload[1]))
          //i.position = action.payload[1]
          i.data.is_displayed = !i.data.is_displayed;
        }
      }

      state.resourceNodes = data;
    },

    addFeaturesNode(state,action){
       state.resourceNodes.push(action.payload)
    },
    

    addNewResourceNode(state, action) {
      const data = state.resourceNodes;
      let flag = false;
      for (const i of data) {
        if (i.id === action.payload[0]) {
          flag = true;
        }
      }

      if (!flag) {
        data.push({
          id: action.payload[0],
          type: "default",
          data: {
            label: `${action.payload[2]} - ${action.payload[1]}`,
            obj: action.payload[1],
            is_displayed: false,
          },
          position: { x: 250, y: 5 },
        });
      }
      state.resourceNodes = data;
    },

    modifyEditorStatus(state, action) {
      const object = action.payload[0];
      const status_data = state.customCodeResourceStatus;

      if (status_data.length === 0) {
        status_data.push({ object_name: object, status: true });
      } else {
        let flag = false;
        for (const i of status_data) {
          if (i.object_name === object) {
            i.status = !i.status;
            flag = true;
            break;
          }
        }

        if (!flag) {
          status_data.push({ object_name: object, status: true });
        }
      }

      state.customCodeResourceStatus = status_data;
    },

    addCustomCodeForEdit(state, action) {
      const object = action.payload[0];
      const resource_name = action.payload[1];
      const custom_code = action.payload[2];
      let flag = false;

      for (const i of state.editCustomData) {
        if (i.object_name === object) {
          i.custom_code = custom_code;
          flag = true;
          break;
        }
      }

      if (!flag) {
        state.editCustomData.push({
          object_name: object,
          custom_code: custom_code,
          resource: resource_name,
        });
      }
    },

    addCustomCode(state, action) {
      const object = action.payload[0];
      const resource_name = action.payload[1];
      const custom_code = action.payload[2];
      let flag = false;

      for (const i of state.customCodeData) {
        if (i.object_name === object) {
          i.custom_code = custom_code;
          flag = true;
          break;
        }
      }

      if (!flag) {
        state.customCodeData.push({
          object_name: object,
          custom_code: custom_code,
          resource: resource_name,
        });
      }
    },

    addNewAttribute(state, action) {
      const attr_data = state.attributes;
      let flag = false;
      let found = false;
      for (const i in attr_data) {
        if (i == action.payload[0]) {
          flag = true;
          break;
        }
      }

      if (flag) {
        for (const i of attr_data[action.payload[0]]) {
          if (i == action.payload[1]) {
            found = true;
            break;
          }
        }
        if (!found) {
          attr_data[action.payload[0]].push(action.payload[1]);
        }
      } else {
        attr_data[`${action.payload[0]}`] = [];
        attr_data[`${action.payload[0]}`].push(action.payload[1]);
      }
    },

    addingNew(state, action) {
      let flag = 0;
      for (const id of state.data) {
        if (id["object_name"] == action.payload[2]) {
          flag = 1;
          break;
        }
      }

      if (flag == 0) {
        state.data.push({
          module: action.payload[0],
          resource: action.payload[1],
          object_name: action.payload[2],
          Resource_type: action.payload[3],
          Arguments: {},
        });
      }
    },
    addNew(state, action) {
      const data1 = state.data;
      let objectLength = Object.keys(data1[0]["Arguments"]).length;
      for (const a of data1) {
        if (
          a["resource"] == action.payload[0] &&
          a["object_name"] == action.payload[1]
        ) {
          if (typeof action.payload[3] == "object") {
            a["Arguments"][action.payload[2]] = action.payload[3];
          } else {
            a["Arguments"][action.payload[2]] = {
              value: action.payload[3],
              is_variable: false,
            };
          }
        }
      }
      state.data = data1;
    },

    updateDataWithCustomCode(state, action) {
      const data1 = state.data;

      for (const a of data1) {
        if (
          a["resource"] == action.payload[0] &&
          a["object_name"] == action.payload[1]
        ) {
          a["Arguments"] = action.payload[2];
          break;
        }
      }

      state.data = data1;
    },

    remove(state, action) {
      const data1 = state.data;
      for (const a of data1) {
        if (
          a["resource"] == action.payload[0] &&
          a["object_name"] == action.payload[1]
        ) {
          if (typeof action.payload[2] == "string") {
            delete a["Arguments"][action.payload[2]];
          } else {
            delete a["Arguments"][action.payload[2][0]][action.payload[2][1]];
          }
        }
      }
      state.data = data1;
    },
    addNewResourse(state, action) {
      state.resourse.push(action.payload[1]);
    },
    deleteResourse(state, action) {
      const data = state.resourse;
      state.resourse = data.filter((ele) => ele[1][2] != action.payload[0]);
      console.log("Finished");
    },

    addColumnValue(state, action) {
      const data1 = state.data;
      for (const a of data1) {
        if (
          a["resource"] == action.payload[0] &&
          a["object_name"] == action.payload[1]
        ) {
          for (const b in a["Arguments"]) {
            if (b == action.payload[2]) {
              a["Arguments"][b].value = action.payload[3];
            }
          }
        }
      }
      state.data = data1;
    },

    addColumnSubValue(state, action) {
      const data1 = state.data;
      for (const a of state.data) {
        if (
          a["resource"] == action.payload[0] &&
          a["object_name"] == action.payload[1]
        ) {
          for (const b in a["Arguments"]) {
            if (b == action.payload[2]) {
              for (const c in a["Arguments"][b]) {
                if (c == action.payload[3]) {
                  a["Arguments"][b][c].value = action.payload[4];
                }
              }
            }
          }
        }
      }
      state.data = data1;
    },

    addColumnSubChildValue(state, action) {
      const data1 = state.data;
      for (const a of state.data) {
        if (
          a["resource"] == action.payload[0] &&
          a["object_name"] == action.payload[1]
        ) {
          for (const b in a["Arguments"]) {
            if (b == action.payload[5]) {
              for (const c in a["Arguments"][b]) {
                if (c == action.payload[2]) {
                  for (const d in a["Arguments"][b][c]) {
                    if (d == action.payload[3]) {
                      a["Arguments"][b][c][d].value = action.payload[4];
                    }
                  }
                }
              }
            }
          }
        }
      }
      state.data = data1;
    },

    // addColumnSubGrandValue(state, action) {
    //   const data1 = state.data;
    //   for (const a of state.data) {
    //     if (
    //       a["resource"] == action.payload[0] &&
    //       a["object_name"] == action.payload[1]
    //     ) {
    //       for (const b in a["Arguments"]) {
    //         if (b == action.payload[7]) {
    //           for (const c in a["Arguments"][b]) {
    //             if (c == action.payload[5]) {
    //               for (const d in a["Arguments"][b][c]) {
    //                 if (d == action.payload[2]) {
    //                   for(const e in a["Arguments"][b][c][d]){
    //                     if(e == action.payload[3]){
    //                       a["Arguments"][b][c][d][e].value = action.payload[4];
    //                     }
    //                     }
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //     state.data = data1;
    // },

    addingImportantNew(state, action) {
      state.important.push({
        module: action.payload[0],
        resource: action.payload[1],
        object_name: action.payload[2],
        Resource_Type: action.payload[3],
        Arguments: {},
      });
    },

    updateWithCustomCodeArguments(state, action) {
      const data1 = state.important;

      for (const a of data1) {
        if (
          a["resource"] == action.payload[0] &&
          a["object_name"] == action.payload[1]
        ) {
          a["Arguments"] = action.payload[2];
        }
      }
      state.important = data1;
    },

    addImportantNew(state, action) {
      const data1 = state.important;

      for (const a of data1) {
        if (
          a["resource"] == action.payload[0] &&
          a["object_name"] == action.payload[1]
        ) {
          a["Arguments"][action.payload[2]] = action.payload[3];
        }
      }
      state.important = data1;
    },

    removeImportant(state, action) {
      console.log("important ", state.important);
      const data1 = state.important;
      for (const a of data1) {
        if (
          a["resource"] == action.payload[0] &&
          a["object_name"] == action.payload[1]
        ) {
          if (typeof action.payload[2] == "string") {
            delete a["Arguments"][action.payload[2]];
          } else {
            if (a["Arguments"][action.payload[2][0]] != undefined)
              delete a["Arguments"][action.payload[2][0]][action.payload[2][1]];
          }
        }
      }
      state.important = data1;
    },
    clearBody(state, action) {
      const data1 = state.data;
      for (const a of data1) {
        if (
          a["resource"] == action.payload[0] &&
          a["object_name"] == action.payload[1]
        ) {
          a["Arguments"] = {};
        }
      }
      state.data = data1;
    },

    clearImportant(state, action) {
      const data1 = state.important;
      for (const a of data1) {
        if (
          a["resource"] == action.payload[0] &&
          a["object_name"] == action.payload[1]
        ) {
          a["Arguments"] = {};
        }
      }
      state.important = data1;
    },

    addtoAttrDelete(state, action) {
      let list = state.attrDeleteList;
      for (const e in list) {
        if (e == action.payload[0]) {
          let delList = list[e];
          let a = action.payload[1];
          if (!delList.includes(a)) {
            delList.push(a);
          } else {
            for (let i = 0; i < delList.length; i++) {
              if (delList[i] == a) {
                delList.splice(i, 1);
              }
            }
          }
          list[e] = delList;
        }
      }
      state.deleteList = list;
    },

    addtoDelete(state, action) {
      let list = state.deleteList;
      for (const e in list) {
        if (e == action.payload[0]) {
          let delList = list[e];
          let a = action.payload[1];
          if (typeof a == "string") {
            if (!delList.includes(a)) {
              delList.push(a);
            } else {
              for (let i = 0; i < delList.length; i++) {
                if (delList[i] == a) {
                  delList.splice(i, 1);
                }
              }
            }
          } else {
            let flag = 0;
            for (let i = 0; i < delList.length; i++) {
              if (typeof delList[i] == "string") {
                if (delList[i] == a[0]) {
                  flag = 1;
                }
              } else {
                if (delList[i][0] == a[0] && delList[i][1] == a[1]) {
                  delList.slice(i, 1);
                  flag = 1;
                }
              }
            }
            if (flag == 0) {
              delList.push(a);
            }
          }
          list[e] = delList;
        }
      }
      state.deleteList = list;
    },
    createDeleteList(state, action) {
      state.deleteList[action.payload] = [];
    },
    createAttrDeleteList(state, action) {
      state.attrDeleteList[action.payload] = [];
    },
    deleteDeleteList(state, action) {
      delete state.deleteList[action.payload];
    },
    createNewTableData(state, action) {
      state.tableData[action.payload] = [];
    },
    deleteAttr(state, action) {
      let array = state.attributes[action.payload[0]];
      const index = array.indexOf(action.payload[1]);
      if (index > -1) {
        array.splice(index, 1);
      }
      state.attributes[action.payload[0]] = array;
      state.attrDeleteList[action.payload[0]] = [];
    },
    addtoTableData(state, action) {
      let flag = 0;
      for (const a of state.tableData[action.payload[0]]) {
        if (a.Argument_Name != undefined) {
          if (a.Argument_Name == action.payload[1].Argument_Name) {
            flag = 1;
          }
        }
        if (a.Attribute_Name != undefined) {
          if (a.Attribute_Name == action.payload[1].Attribute_Name) {
            flag = 1;
          }
        }
      }

      if (flag == 0) {
        state.tableData[action.payload[0]].push(action.payload[1]);
      }
    },
    removeFromTableData(state, action) {
      let content = state.tableData[action.payload[0]];
      let e = action.payload[1];
      console.log("hdbfjhefhj")
      for (let i = 0; i < content.length; i++) {
        if (typeof e == "string") {
          if (content[i].Argument_Name == e) {
            content.splice(i, 1);
            break;
          }
          if (content[i].Attribute_Name == e) {
            content.splice(i, 1);
            break;
          }
        } else {
          if (content[i].Argument_Name == e[0]) {
            let Child_Arguments = content[i].Child_Arguments.filter(
              (n) => n.Argument_Name != e[1]
            );
            content[i].Child_Arguments = Child_Arguments;
            break;
          }
        }
      }
    },
    addtoEditData(state, action) {
      state.editData[action.payload[0]] = action.payload[1];
      state.editOutput[action.payload[0]] = action.payload[2];
    },
    addToEditVariables(state, action) {
      state.editVariables[action.payload[0]] = action.payload[1];
    },
    changeEditVariable(state, action) {
      const v = state.editVariables[action.payload[0]];
      for (const i of v) {
        for (const j in i) {
          if (j == action.payload[1]) {
            i[j] = action.payload[2];
          }
        }
      }
    },
    deleteAll(state) {
      state.data = [];
      state.resourse = [];
      state.important = [];
      state.deleteList = {};
      state.editData = {};
      state.editOutput = {};
      state.tableData = {};
      state.hiding = [];
    },
    createHide(state, action) {
      let flag = 0;
      for (const id of state.hiding) {
        if (id["object_name"] == action.payload[2]) {
          flag = 1;
          break;
        }
      }
      if (flag == 0) {
        state.hiding.push({
          module: action.payload[0],
          resource: action.payload[1],
          object_name: action.payload[2],
          Arguments: {},
        });
      }
    },
    addHide(state, action) {
      const data1 = state.hiding;
      for (const a of data1) {
        if (
          a["resource"] == action.payload[0] &&
          a["object_name"] == action.payload[1]
        ) {
          if (typeof action.payload[3] == "string") {
            a["Arguments"][action.payload[2]] = false;
          } else {
            let child = {};
            for (const a in action.payload[3]) {
              if (action.payload[3][a].value != undefined) {
                child[a] = false;
              } else {
                child[a] = {};
                for (const b in action.payload[3][a]) {
                  child[a][b] = false;
                }
              }
            }
            a["Arguments"][action.payload[2]] = child;
          }
        }
      }
      state.hiding = data1;
    },
    removeHide(state, action) {
      const data1 = state.hiding;
      for (const a of data1) {
        if (
          a["resource"] == action.payload[0] &&
          a["object_name"] == action.payload[1]
        ) {
          if (typeof action.payload[2] == "string") {
            delete a["Arguments"][action.payload[2]];
          } else {
            delete a["Arguments"][action.payload[2][0]][action.payload[2][1]];
          }
        }
      }
      state.hiding = data1;
    },
    addHideValue(state, action) {
      const data1 = state.hiding;
      let n = 0;
      for (const a of data1) {
        if (
          a["resource"] == action.payload[0] &&
          a["object_name"] == action.payload[1]
        ) {
          for (const b in a["Arguments"]) {
            if (b == action.payload[2]) {
              if (a["Arguments"][b] == false) {
                a["Arguments"][b] = true;
                state.data[n]["Arguments"][b].is_variable = true;
              } else {
                a["Arguments"][b] = false;
                state.data[n]["Arguments"][b].is_variable = false;
              }
            }
          }
        }
        n = n + 1;
      }
      state.hiding = data1;
    },
    addHideSubValue(state, action) {
      const data1 = state.hiding;
      let n = 0;
      for (const a of state.hiding) {
        if (
          a["resource"] == action.payload[0] &&
          a["object_name"] == action.payload[1]
        ) {
          for (const b in a["Arguments"]) {
            if (b == action.payload[2]) {
              for (const c in a["Arguments"][b]) {
                if (c == action.payload[3]) {
                  if (a["Arguments"][b][c] == false) {
                    a["Arguments"][b][c] = true;
                    if (state.data[n]["Arguments"][b][c] != undefined) {
                      state.data[n]["Arguments"][b][c].is_variable = true;
                    }
                  } else {
                    a["Arguments"][b][c] = false;
                    if (state.data[n]["Arguments"][b][c] != undefined)
                      state.data[n]["Arguments"][b][c].is_variable = false;
                  }
                }
              }
            }
          }
        }
        n = n + 1;
      }
      state.hiding = data1;
    },

    addHideSubChildValue(state, action) {
      const data1 = state.hiding;
      let n = 0;
      for (const a of state.hiding) {
        if (
          a["resource"] == action.payload[0] &&
          a["object_name"] == action.payload[1]
        ) {
          for (const b in a["Arguments"]) {
            if (b == action.payload[4]) {
              for (const c in a["Arguments"][b]) {
                if (c == action.payload[2]) {
                  for (const d in a["Arguments"][b][c]) {
                    if (d == action.payload[3]) {
                      if (a["Arguments"][b][c][d] == false) {
                        a["Arguments"][b][c][d] = true;
                        state.data[n]["Arguments"][b][c][d].is_variable = true;
                      } else {
                        a["Arguments"][b][c][d] = false;
                        state.data[n]["Arguments"][b][c][d].is_variable = false;
                      }
                    }
                  }
                }
              }
            }
          }
        }
        n = n + 1;
      }
      state.hiding = data1;
    },
  },
});
const store = configureStore({
  reducer: {
    datacenter: dataSlicer.reducer,
    templateDataSlice: templateDataSlice.reducer,
    tablesSlice: tablesSlice.reducer,
  },
});
export const actions = dataSlicer.actions;
export const {
  updateValidation,
  updateProvider,
  updateTemplateName,
  updateObjectName,
  updateResourceName,
  updateTemplatePanelOpen,
  updateProviderNames,
  updateModuleName,
  updateType,
  updateTypeNames,
  updateRegion,
  updateTemplateDesc,
  clearTemplateDataState,
  checkovExecutionSelection,
  updateCheckovProjectCheckbox,
  intializeCheckovData,
  updateCheckovTemplateCheckbox,
  updateTemplateSavedStatus,
  updateLanguage,
  updateTemplateCurrentName,
  updatetemplatedesc,
  updateSnowflakeId,
  updateCheckUser,
  updateemail,
  updateUserMail,
  updateUserName,
  updateUserRole,
  updateUsersList,
  updateInitialUsers,
  updateUserCheckCount
} = templateDataSlice.actions;

export const {
  addTableData,
  deleteFromTable,
  clearTablesState,
  initTableData,
} = tablesSlice.actions;
export default store;
