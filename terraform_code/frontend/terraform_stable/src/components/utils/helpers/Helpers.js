export const selectVariables = () => {
    const variable_arguments = [];

    for (const i in hidding) {
      for (const j in hidding[i]["Arguments"]) {
        if (typeof hidding[i]["Arguments"][j] == "boolean") {
          if (hidding[i]["Arguments"][j] == true) {
            const value = getArgumentValue(j, hidding[i]["object_name"], false);
            variable_arguments.push(value);
          }
        } else {
          for (const child in hidding[i]["Arguments"][j]) {
            if (hidding[i]["Arguments"][j][child] == true) {
              const value = getArgumentValue(
                child,
                hidding[i]["object_name"],
                true
              );
              variable_arguments.push(value);
            }
          }
        }
      }
    }
    return variable_arguments;
  };

  export function is_variable(argument_name, obj_name, is_child) {
    if (!is_child) {
      for (const hide_ele in hidding) {
        if (hidding[hide_ele]["object_name"] == obj_name) {
          for (const argument in hidding[hide_ele]["Arguments"]) {
            if (typeof hidding[hide_ele]["Arguments"][argument] == "boolean") {
              if (argument == argument_name) {
                if (hidding[hide_ele]["Arguments"][argument_name] == true) {
                  return true;
                } else {
                  return false;
                }
              }
            }
          }
        }
      }
    } else {
      for (const hide_ele in hidding) {
        if (hidding[hide_ele]["object_name"] == obj_name) {
          for (const argument in hidding[hide_ele]["Arguments"]) {
            if (typeof hidding[hide_ele]["Arguments"][argument] != "boolean") {
              for (const sub_attr in hidding[hide_ele]["Arguments"][argument]) {
                if (sub_attr == argument_name) {
                  if (
                    hidding[hide_ele]["Arguments"][argument][sub_attr] == true
                  ) {
                    return true;
                  } else {
                    return false;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  export async function templateValidation() {
    const name = template.current.value;
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_,. ";
    let flag = 0;
    for (const a of name) {
      if (!characters.includes(a)) {
        flag = 1;
        break;
      }
    }
    if (flag != 0) {
      setTemplateValid(true);
    } else {
      setTemplateValid(false);
      const response = await AxiosInstance.post("/validation", {
        template_name: template.current.value,
      });
      const data = response.data;
      if (data == "Failed") {
        setExistingTemplate(true);
      } else {
        setExistingTemplate(false);

        setProviders([
          { id: "AWS", value: "AWS" },
          { id: "GCP", value: "GCP" },
          { id: "AZURE", value: "Azure" },
          { id: "SNOWFLAKE", value: "Snowflake" },
        ]);
      }
    }
  }
  
  export const getArgumentValue = (argument_name, obj_name, is_child) => {
    if (!is_child) {
      for (const body_ele in body) {
        if (body[body_ele]["object_name"] == obj_name) {
          for (const argument in body[body_ele]["Arguments"]) {
            if (argument == argument_name) {
              return body[body_ele]["Arguments"][argument_name].value;
            }
          }
        }
      }
    } else {
      for (const body_ele in body) {
        if (body[body_ele]["object_name"] == obj_name) {
          for (const argument in body[body_ele]["Arguments"]) {
            for (const sub_attr in body[body_ele]["Arguments"][argument]) {
              if (sub_attr == argument_name) {
                return body[body_ele]["Arguments"][argument][sub_attr].value;
              }
            }
          }
        }
      }
    }
  };

