import { TextareaHTMLAttributes } from 'react';

interface IMyTextAreaProps<T> extends TextareaHTMLAttributes<T> {
  errors: any;
}

export default function AppTextArea(props: IMyTextAreaProps<any>) {
  const errors = props.errors || {};
  const name = props.name || '_';
  const currentError = errors[name] || '';

  return (
    <>
      <textarea
        name={props.name}
        onChange={props.onChange}
        value={props.value}
        data-has-errors={currentError.length ? '1' : '0'}
      />
      <span data-has-errors={currentError.length ? '1' : '0'}>
        {currentError}
      </span>
    </>
  );
}
