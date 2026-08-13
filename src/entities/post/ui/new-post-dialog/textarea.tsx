import React, { useEffect, useRef } from "react";

export function Textarea({
  text,
  onChange,
  onSubmitIntent,
}: {
  text: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  onSubmitIntent: () => void;
}): React.ReactElement {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
    resizeTextarea(textareaRef);
  }, []);

  useEffect(() => {
    resizeTextarea(textareaRef);
  }, [text]);

  const onKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onSubmitIntent();
    }
  };

  return (
    <textarea
      ref={textareaRef}
      name="text"
      placeholder="What's on your mind?"
      value={text}
      onChange={onChange}
      onKeyUp={onKeyUp}
      rows={3}
      className="w-full resize-none scrollbar-none overflow-clip border-b border-white px-3 py-2"
    />
  );
}

function resizeTextarea(textareaRef: React.RefObject<HTMLTextAreaElement | null>) {
  const textarea = textareaRef.current;
  if (!textarea) {
    return;
  }
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight + 16}px`;
}
