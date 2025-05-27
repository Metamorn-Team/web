import React from "react";

export function renderMultilineMessage(message: string) {
  return message.split("\n").map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i !== message.split("\n").length - 1 && <br />}
    </React.Fragment>
  ));
}
