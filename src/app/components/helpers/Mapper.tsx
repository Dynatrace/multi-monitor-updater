import { ReactElement, cloneElement } from 'react';
import { mergeProps } from '@react-aria/utils';

type MappingProps = {
  children: ReactElement;
  /** state control props - controlled version */
  onChange?: (value: string) => void;
  value?: string;
  /** state control props - uncontrolled version */
  defaultValue?: unknown;
};

/** Returns wrapper component for mapping select-specific props to props required by FilterBar.Item */
export const Mapper = (props: MappingProps) => {
  const { children, defaultValue } = props;
  const { defaultSelectedId } = children.props;
  const handleChange = (val: string) => {
    props.onChange?.(val);
  };
  return cloneElement(children, {
    ...mergeProps(children.props, {
      value: defaultSelectedId || defaultValue,
      onChange: handleChange,
    }),
  });
};
