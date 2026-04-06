import { useEffect, useRef, type TextareaHTMLAttributes } from 'react';
import { clsx } from 'clsx'

export interface AutosizeTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function AutosizeTextarea({ className, ...props }: AutosizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [props.value, props.defaultValue]);

  return (
    <textarea
      {...props}
      ref={textareaRef}
      className={clsx('form-control', className)}
      onInput={(e) => {
        adjustHeight();
        if (props.onInput) props.onInput(e as React.FormEvent<HTMLTextAreaElement>);
      }}
    />
  );
}
