import React, { useRef, useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import { BsFillSave2Fill } from "react-icons/bs";

const TodoItem = React.memo(({ item, onDelete, onDone, onSave }) => {
  const [edit, setEdit] = useState(false);
  const [text, setText] = useState(item.activity);
  const textareaRef = useRef(null);

  // Auto grow without causing forced reflow everywhere
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [text]);

  return (
    <div className="content">
      <textarea
        ref={textareaRef}
        value={text}
        readOnly={!edit}
        onChange={(e) => setText(e.target.value)}
        rows={1}
        style={item.done ? { backgroundColor: "#ccffcc" } : {}}
      />

      <div className="dateicons">
        <div className="dateTime">
          {new Date(item.dateTime).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
          })}
          (
          <span>
            {new Date(item.dateTime).toLocaleString("en-IN", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </span>
          )
        </div>

        <div className="contentIcons">
          <span className="iconBtn">
            <FaCheck
              onClick={() => onDone(item.id)}
              style={item.done ? { color: "green" } : {}}
            />
          </span>

          <span className="iconBtn">
            <FaEdit onClick={() => setEdit(true)} />
          </span>

          <span className="iconBtn">
            <BsFillSave2Fill
              onClick={() => {
                onSave(item.id, text);
                setEdit(false);
              }}
            />
          </span>

          <span className="iconBtn">
            <FaTrash onClick={() => onDelete(item.id)} />
          </span>
        </div>
      </div>
    </div>
  );
});

export default TodoItem;
