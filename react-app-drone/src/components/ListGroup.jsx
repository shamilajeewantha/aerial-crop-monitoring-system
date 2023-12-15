import { useState } from "react";

function ListGroup({ items, onSelectItem }) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <>
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            style={{
              backgroundColor: selectedIndex === index ? "#28a745" : "white",
              cursor: "pointer",
              padding: "10px",
              transition: "background-color 0.3s ease",
            }}
            key={item}
            onClick={() => {
              setSelectedIndex(index);
              onSelectItem(item);
            }}
            onMouseEnter={() => {
              setSelectedIndex(index); // Optional: Change background color on hover
            }}
            onMouseLeave={() => {
              setSelectedIndex(-1); // Optional: Reset background color on mouse leave
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
