import React, { useState, useEffect } from "react";

const FormBuilder = () => {
  const [inputs, setInputs] = useState([]);
  const [questions, setQuestions] = useState(0);
  const [checkboxes, setCheckboxes] = useState(0);

  useEffect(() => {
    console.log(inputs);
  }, [inputs]);

  const addSimpleInput = () => {
    setInputs([
      ...inputs,
      {
        id: crypto.randomUUID(),
        type: "simple",
        value: "",
        question: questions,
      },
    ]);
    setQuestions(questions + 1);
  };

  const addMultipleInput = () => {
    setInputs([
      ...inputs,
      {
        id: crypto.randomUUID(),
        type: "parent",
        value: "",
        checkbox: checkboxes,
        children: [],
      },
    ]);
    setCheckboxes(checkboxes + 1);
  };

  const addChildInput = (parentId) => {
    setInputs(
      inputs.map((input) => {
        if (input.id === parentId && input.type === "parent") {
          return {
            ...input,
            children: [
              ...input.children,
              {
                id: crypto.randomUUID(),
                value: "",
                inputType: "text",
              },
            ],
          };
        }
        return input;
      })
    );
  };

  const removeInput = (id) => {
    setInputs(inputs.filter((input) => input.id !== id));
  };

  const removeChildInput = (parentId, childId) => {
    setInputs(
      inputs.map((input) => {
        if (input.id === parentId && input.type === "parent") {
          return {
            ...input,
            children: input.children.filter((child) => child.id !== childId),
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
    <form
      method="POST"
      action="http://localhost:8080/form/create"
      className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md space-y-6"
    >
      <div className="space-y-4">
        <input
          name="name"
          placeholder="Nombre del formulario"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="description"
          placeholder="Descripción del formulario"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        {inputs.map((input, index) => {
          if (input.type === "simple") {
            return (
              <div key={input.id} className="p-4 border rounded-md">
                <div className="flex justify-between items-center">
                  <label className="block mb-1 font-semibold">
                    Pregunta simple
                  </label>
                  <button
                    type="button"
                    onClick={() => removeInput(input.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
                <input
                  name={`questions[${input.question}]`}
                  value={input.value}
                  onChange={(e) => handleChange(index, e.target.value)}
                  placeholder="Escribe tu pregunta"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            );
          } else if (input.type === "parent") {
            return (
              <div key={input.id} className="p-4 border rounded-md space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block mb-1 font-semibold">
                    Pregunta con opciones
                  </label>
                  <button
                    type="button"
                    onClick={() => removeInput(input.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
                <input
                  name={`checkboxes[${input.checkbox}].question`}
                  value={input.value}
                  onChange={(e) => handleChange(index, e.target.value)}
                  placeholder="Escribe tu pregunta"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                <button
                  type="button"
                  onClick={() => addChildInput(input.id)}
                  className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  + Opción
                </button>

                {input.children.map((child, childIndex) => (
                  <div key={child.id} className="mt-2 flex items-center gap-2">
                    <input
                      type={child.inputType}
                      name={`checkboxes[${input.checkbox}].option[${childIndex}]`}
                      value={child.value}
                      placeholder="Escribe una opción"
                      onChange={(e) =>
                        handleChange(index, e.target.value, true, childIndex)
                      }
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeChildInput(input.id, child.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={addSimpleInput}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          + Input Simple
        </button>
        <button
          type="button"
          onClick={addMultipleInput}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          + Input Multiple
        </button>
      </div>

      <div>
        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Enviar formulario
        </button>
      </div>
    </form>
  );
};

export default FormBuilder;
