import { InputHTMLAttributes } from 'react';

interface IMyInputProps<T> extends InputHTMLAttributes<T> {
  errors: any;
}

export default function AppInput(props: IMyInputProps<any>) {
  const errors = props.errors || {};
  const name = props.name || '_';
  const currentError = errors[name] || '';

  return (
    <>
      {props.type !== 'checkbox' ? null : (
        <label
          htmlFor={props.id}
          data-is-cheked={props.checked ? '1' : '0'}></label>
      )}
      <input data-has-errors={currentError.length ? '1' : '0'} {...props} />
      <span data-has-errors={currentError.length ? '1' : '0'}>
        {currentError}
      </span>
    </>
  );
}
