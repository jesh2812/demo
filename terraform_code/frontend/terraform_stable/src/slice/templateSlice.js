import { createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";
import { updateProvider } from "../store/store";

const initialState = {
  provider: "",
  template_name: "",
  template_desc: "",
  temp_desc: "",
  template_saved:false,
  object_name: "",
  resource_name: "",
  module_name: "",
  type:"",
  region:"",
  language:"HCL",
  validation: {
    template: false,
    object: false,
    provider: false,
    resource: false,
    module: false,
    type:false,
    region:false,
  },
  modulesNames:[],
  loading: false,
  resources: [],
  modul: "",
  resour: "",
  providName: "",
  types: "",
  typeNamess: [],
  variablesExistance: null,
  isTemplatePanelOpen:true,
  exception: "",
  exceptionStatus: false,
  errorMessage: false,
  iteration: 0,
  argumentdata: null,
  attributedata: null,
  temp: 0,
  providerNames:[],
  variableArguments: [],
  typeNames:[],
  executingTemplate: false,
  saved: false,
  checked: false,
  checkovExecutionSelection:{},
  templateValid: false,
  existingTemplate: false,
  projectName: "",
  projectValid: false,
  roleName: "",
  roleValid: false,
  objects: "",
  objectExist: false,
  providers: [],
  objectValid: false,
  obj: "",
  accessToken: "",
  accessTokenValid: false,
  repoName: "",
  repoNameValid: false,
  branch: "",
  branchValid: false,
  message: "",
  messageValid: false,
  snowflakeId: "",
  check_user: false,
  email_check: "",
  userName: "",
  userMail: "",
  userRole: "user",
  usersList: false,
  initialUsers : [
    { name: 'terraformAdmin', email: 'terraform@tigeranalytics.com', role: 'Admin' }
  ],
  userCheckCount : 0,
};
export var temp_name = "";

const templateDataSlice = createSlice({
  name: "templateData",
  initialState: initialState,
  reducers: {
    clearTemplateDataState: () => initialState, 
    updateTemplateSavedStatus(state, action){
      state.template_saved = action.payload
    },

    updateValidation(state, action){
        state.validation = {...state.validation, ...action.payload[0]}
    },
    updateProvider(state, action) {
      state.provider = action.payload;
    },
    updateTemplateName(state, action) {
      state.template_name = action.payload;
    },
    updateTemplateCurrentName(state, action) {
      state.template_name.current = action.payload;
    },
    updateObjectName(state, action) {
      state.object_name = action.payload;
    },
    updateResourceName(state, action) {
      state.resource_name = action.payload;
    },
    updateTemplatePanelOpen(state,action){
        state.isTemplatePanelOpen = !state.isTemplatePanelOpen
    },
    updateProviderNames(state, action){
      state.providerNames = action.payload;
    },
    updateModuleName(state, action){
      state.module_name = action.payload;
    },
    updateType(state, action){
      state.type = action.payload;
    },
    updateTypeNames(state, action){
      state.typeNames = action.payload;
    },
    updateRegion(state, action){
      state.region = action.payload
    },
    updatetemplatedesc(state, action){
      
      state.temp_desc=action.payload
      state.template_desc = state.temp_desc
    },
    updateTemplateDesc(state, action){
      state.template_desc = action.payload
    },
    updateCheckovData(state, action){
      state.checkovExecutionSelection = action.payload
    },

    updateCheckovTemplateCheckbox(state, action){
      const project = action.payload[0]
      state.template_name = action.payload[1]
      temp_name = action.payload[1];
      console.log(temp_name)
      const ele = state.checkovExecutionSelection[project].templates.filter((ele)=>ele.template_name==state.template_name)[0] 
      const isChecked = ele.isChecked
      ele.isChecked = !isChecked
    },

    updateCheckovProjectCheckbox(state, action){
      const ele = state.checkovExecutionSelection[action.payload]
      ele.isChecked = !ele.isChecked
      // if(ele.isChecked==false){
      //   ele.isChecked = null
      // } 
      ele.templates.map((template)=>{
        template.isChecked = ele.isChecked
      })
      
    },
    intializeCheckovData(state, action){
      state.checkovExecutionSelection = action.payload
    },

    updateModuleNames(state, action){
      state.modulesNames = action.payload
    },
    
    updateLoading(state, action){
      state.loading = action.payload
    },

    updateResources(state, action){
      state.resources  = action.payload
    },

    updateModul(state, action){
      state.modul = action.payload
    },

    updateResour(state, action){
      state.resour = action.payload
    },

    updateArgumentData(state, action){
      state.argumentdata=action.payload
    },

    updateAttributeData(state, action){
      state.attributedata = action.payload
    },

    updateProvidName(state, action){
      state.providName = action.payload
    },

    updateTypes(state, action){
      state.types = action.payload
    },

    updateTypeNamess(state, action){
      state.typeNamess = action.payload
    },

    updateVariablesExistance(state, action){
      state.variablesExistance = action.payload
    },

    updateVariableArguments(state, action){
      state.variableArguments = action.payload
    },

    updateException(state, action){
      state.exception = action.payload
    },

    updateExceptionStatus(state, action){
      state.exceptionStatus = action.payload
    },

    updateErrorMessage(state, action){
      state.errorMessage = action.payload
    },

    updateIteration(state, action){
      state.iteration = action.payload
    },

    updateTemplateDesc(state, action){
      state.temp = action.payload
    },

    updateExecutingTemplate(state, action){
      state.executingTemplate = action.payload
    },

    updateSaved(state, action){
      state.saved = action.payload
    },

    updateChecked(state, action){
      state.checked = action.payload
    },

    updateTemplateValid(state,action){
      state.templateValid = action.payload
    },

    updateExistingTemplate(state, action){
      state.existingTemplate = action.payload
    },

    updateProjectName(state, action){
      state.projectName = action.payload
    },

    updateProjectValid(state,action){
      state.projectValid = action.payload
    },

    updateRoleName(state, action){
      state.roleName = action.payload
    },

    updateRoleValid(state, action){
      state.roleValid = action.payload
    },

    updateObject(state, action){
      state.objects = action.payload
    },

    updateObjectExist(state, action){
      state.objectExist = action.payload
    },

    updateProviders(state, action){
      state.providers = action.payload
    },

    updateObjectValid(state, action){
      state.objectValid = action.payload
    },

    updateObj(state, action){
      state.obj = action.payload
    },

    updateAccessToken(state, action){
      state.accessToken = action.payload
    },

    updateAccessTokenValid(state, action){
      state.accessTokenValid = action.payload
    },

    updateRepoName(state, action){
      state.repoName = action.payload
    },

    updateRepoNameValid(state, action){
      state.repoNameValid = action.payload
    },

    updateBranch(state, action){
      state.branch = action.payload
    },

    updateBranchValid(state, action){
      state.branchValid = action.payload
    },

    updateMessage(state, action){
      state.message = action.payload
    },

    updateMessageValid(state, action){
      state.messageValid = action.payload
    },

    updateLanguage(state,action){
      state.language = action.payload
    },

    updateSnowflakeId(state, action){
      state.snowflakeId = action.payload
    },

    updateCheckUser(state, action){
      state.check_user = action.payload
    },

    updateemail(state,action){
      state.email_check = action.payload
    },

    updateUserName(state,action){
      state.userName = action.payload
    },

    updateUserMail(state,action){
      state.userMail = action.payload
    },

    updateUserRole(state, action){
      state.userRole = action.payload
    },

    updateUsersList(state, action){
      state.usersList = action.payload
    },

    updateInitialUsers(state,action){
      state.initialUsers.push(action.payload)
    },

    updateUserCheckCount(state, action){
      state.userCheckCount = action.payload
    }

    
  },
});

export default templateDataSlice;
