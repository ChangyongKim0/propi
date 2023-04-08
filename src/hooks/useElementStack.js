import { useReducer } from "react";

const useElementStack = () => {
  const reduceElementStack = (state, action) => {
    const new_state = [...state];
    switch (action.type) {
      case "create":
        const wrapped_element = (
          <div
            id={action.element_type + "-type-stacked-element-" + action.id}
            style={{ width: 0, height: 0 }}
          >
            {action.element}
          </div>
        );
        new_state.push({
          id: action.id,
          element_type: action.element_type,
          element: wrapped_element,
          callback: action.callback,
        });
        return new_state;
      case "create multiple":
        action.data.map((e) => {
          const wrapped_element = (
            <div
              id={e.element_type + "-type-stacked-element-" + e.id}
              style={{ width: 0, height: 0 }}
            >
              {e.element}
            </div>
          );
          new_state.push({
            id: e.id,
            element_type: e.element_type,
            element: wrapped_element,
            callback: e.callback,
          });
        });
        // return new_state.filter(
        //   (e) =>
        //     action.data.find(
        //       (e2) => e2.id == e.id && e.element_type == e2.element_type
        //     ) != undefined
        // );
        return [...new_state];
      case "update":
        const wrapped_element2 = (
          <div
            id={action.element_type + "-type-stacked-element-" + action.id}
            style={{ width: 0, height: 0 }}
          >
            {action.element}
          </div>
        );
        return state.map((e) => {
          return e.id == action.id && e.element_type == action.element_type
            ? { ...e, element: wrapped_element2 }
            : e;
        });

      case "delete":
        return state.filter(
          (e) => e.id != action.id || e.element_type != action.element_type
        );
      case "delete by element type":
        return state.filter((e) => e.element_type != action.element_type);
      case "delete all":
        return [];
      default:
        return state;
    }
  };

  const [element_stack, setElementStack] = useReducer(reduceElementStack, []);

  const getElementStackByIdAndElementStack = (id, element_type) => {
    return document.getElementById(
      element_type + "-type-stacked-element-" + id
    );
  };

  return [element_stack, setElementStack, getElementStackByIdAndElementStack];
};

export default useElementStack;
