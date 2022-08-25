import React from "react";
//this input give back a label and depending on the props.type will give back a textarea ,checkbox or text input
function FormInput(props) {
  console.log(props.value, "props.value");
  return (
    // label's class changes depending on what type
    <div className={props.type === "checkbox" ? "form-check mb-3" : "mb-3"}>
      <label
        htmlFor={props.inputName}
        className={
          props.type === "checkbox" ? "form-check-label" : "form-label"
        }
      >
        {props.labelValue}
      </label>
      {/* //if the type is text area return this input  */}
      {props.type === "textArea" ? (
        <textarea
          className="form-control"
          name={props.inputName}
          onChange={props.onChange}
          cols={parseFloat(props.cols, 10)}
          rows={parseFloat(props.rows, 10)}
          defaultValue={props.value}
        ></textarea>
      ) : (
        /* or return an input with either type of text or checkbox */
        <input
          className={
            props.type === "checkbox" ? "form-check-input" : "form-control"
          }
          name={props.inputName}
          type={props.type}
          onChange={props.onChange}
          defaultValue={props.value && props.value}
          defaultChecked={props.value}
        ></input>
      )}
    </div>
  );
}

export default FormInput;
