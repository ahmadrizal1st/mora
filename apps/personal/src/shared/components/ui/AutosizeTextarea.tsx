import React, { useEffect, useRef, useImperativeHandle, type TextareaHTMLAttributes } from 'react';
import { clsx } from 'clsx'

export type AutosizeTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export const AutosizeTextarea = React.forwardRef<HTMLTextAreaElement, AutosizeTextareaProps>(
  ({ className, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Merge forwarded ref with local ref
    useImperativeHandle(ref, () => textareaRef.current!);

    const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    };

    useEffect(() => {
      adjustHeight();
      
      // Handle window resize or other layout changes
      window.addEventListener('resize', adjustHeight);
      return () => window.removeEventListener('resize', adjustHeight);
    }, [props.value, props.defaultValue]);

    return (
      <textarea
        {...props}
        ref={textareaRef}
        className={clsx('form-control', className)}
        onInput={(e) => {
          adjustHeight();
          if (props.onInput) props.onInput(e);
        }}
      />
    );
  }
);

AutosizeTextarea.displayName = 'AutosizeTextarea';
