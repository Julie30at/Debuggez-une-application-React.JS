import PropTypes from "prop-types";

import "./style.scss";

export const FIELD_TYPES = {
  INPUT_TEXT: 1,
  TEXTAREA: 2,
};

// ajout des props value et onChange
const Field = ({ type = FIELD_TYPES.INPUT_TEXT, label, name, placeholder, value, onChange }) => {
  let component;
  switch (type) {
    case FIELD_TYPES.INPUT_TEXT:
      component = (
        <input
          id={name}
          type="text"
          name={name}
          placeholder={placeholder}
          data-testid="field-testid"
          value={value}
          onChange={onChange}
        />
      );
      break;
     case FIELD_TYPES.TEXTAREA:
      component = (
        <textarea
          id={name}
          name={name}
          placeholder={placeholder} 
          data-testid="field-testid"
          value={value} 
          onChange={onChange} 
        />
      );
      break;
    default:
      component = (
        <input
          id={name}
          type="text"
          name={name}
          placeholder={placeholder}
          data-testid="field-testid"
          value={value}
          onChange={onChange}
        />
      );
  }
  return (
    <div className="inputField">
      <span>{label}</span>
      {component}
    </div>
  );
};

Field.propTypes = {
  type: PropTypes.oneOf(Object.values(FIELD_TYPES)),
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};
 Field.defaultProps = {
   label: "",
   placeholder: "",
   type: FIELD_TYPES.INPUT_TEXT,
   name: "field-name",
   value: "",
   onChange: ()=>{},
 }

export default Field;
