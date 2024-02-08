import { ComponentPropsWithoutRef, FC } from 'react';

// This component is used to display text with new lines, it will split the text
// into paragraphs based on the new line character.

type NewLineTextProps = ComponentPropsWithoutRef<'p'> & {
  text: string;
};

const NewLineText: FC<NewLineTextProps> = ({ text, ...props }) => {
  const splitText = text.split('\n');
  return (
    <p {...props}>
      {splitText.map((line, index) => (
        <span key={`${line}-${index * 2}`}>
          {line}
          {index < splitText.length - 1 && <br />}
        </span>
      ))}
    </p>
  );
};

export default NewLineText;
