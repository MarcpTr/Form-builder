import React, { useState, useEffect } from "react";


const FormBuilder = () => {
  
  const [inputs, setInputs] = useState([]);
  const [questions, setQuestions] = useState(0);
  const [checkboxes, setCheckboxes] = useState(0);
  useEffect(()=>{
    console.log(inputs);
  },[inputs]);
 
  const addSimpleInput = () => {
    setInputs([
      ...inputs,
      {
        type: 'simple',
        value: '',
        question: questions
      }
    ]);
    setQuestions(questions + 1)
  };

  const addParentInput = () => {
    setInputs([
      ...inputs,
      {
        type: 'parent',
        value: '',
        checkbox: checkboxes,
        children: []
      }
    ]);
    setCheckboxes(checkboxes + 1 )
  };

  const addChildInput = (parentId) => {
    setInputs(
      inputs.map((input) => {
        if (input.id === parentId && input.type === 'parent') {
          return {
            ...input,
            children: [
              ...input.children,
              {
                value: '',
                inputType: 'text'
              }
            ]
          };
        }
        return input;
      })
    );
  };

  const handleChange = (index, value, isChild = false, childIndex = null) => {
    const updatedInputs = [...inputs];
    if (isChild) {
      updatedInputs[index].children[childIndex].value = value;
    } else {
      updatedInputs[index].value = value;
    }
    setInputs(updatedInputs);
  };

  return (
    <form method="POST" action="http://localhost:8080/form/create">
      <input name="name" />
      <input name="description" />
      {
      
      inputs.map((input, index) => {
        if (input.type === 'simple') {
          return (
            <div key={input.id} style={{ marginBottom: '1em' }}>
              <input
                name={`questions[${input.question}]`}
                value={input.value}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            </div>
          );
        } else if (input.type === 'parent') {
          return (
            <div  style={{ marginBottom: '1em', padding: '0.5em', border: '1px solid #ccc' }}>
              <input
                name={`checkboxes[${input.checkbox}].question`}
                value={input.value}
                onChange={(e) => handleChange(index, e.target.value)}
              />
              <button type="button" onClick={() => addChildInput(input.id)}>+ Hijo</button>

              {input.children.map((child, childIndex) => (
                <div key={child.id} style={{ marginLeft: '1em' }}>
                  <input
                    type={child.inputType}
                    name={`checkboxes[${input.checkbox}].option[${childIndex}]`}
                    value={child.value}
                    placeholder="Child input"
                    onChange={(e) =>
                      handleChange(index, e.target.value, true, childIndex)
                    }
                  />
                </div>
              ))}
            </div>
          );
        }
        return null;
      })}

      <div style={{ marginTop: '1em' }}>
        <button type="button" onClick={addSimpleInput}>+ Input Simple</button>
        <button type="button" onClick={addParentInput} style={{ marginLeft: '1em' }}>+ Input Padre</button>
      </div>

      <br />
      <button type="submit">Enviar</button>
    </form>
  );
}


export default FormBuilder;