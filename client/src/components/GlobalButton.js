import React from "react";

function GlobalButton({ btnTitle, onClickHandler }) {
  return (
    <>
      <button className="button-main" onClick={onClickHandler}>
        {btnTitle}
      </button>
    </>
  );
}

export default GlobalButton;
