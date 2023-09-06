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
