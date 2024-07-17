import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
  ClipboardEvent,
} from "react";

interface CodeInputProps {
  length?: number;
  onComplete: (code: string) => void;
}

const CodeInput: React.FC<CodeInputProps> = ({ length = 5, onComplete }) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.slice(-1);
    if (!/^\d$/.test(value) && value !== "") {
      return;
    }

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newValues.every((val) => val !== "")) {
      onComplete(newValues.join(""));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newValues = [...values];
      newValues[index] = "";
      setValues(newValues);

      if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    if (!/^\d+$/.test(pasteData)) {
      return;
    }

    const pasteValues = pasteData.split("").slice(0, length);
    const newValues = [...values];
    for (let i = index; i < length && i - index < pasteValues.length; i++) {
      newValues[i] = pasteValues[i - index];
    }
    setValues(newValues);

    if (newValues.every((val) => val !== "")) {
      onComplete(newValues.join(""));
    }
  };

  return (
    <div className="flex space-x-2 ">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          maxLength={1}
          placeholder={(index + 1).toString()}
          value={values[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={(e) => handlePaste(e, index)}
          className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
        />
      ))}
    </div>
  );
};

export default CodeInput;
