import React, { RefObject, CSSProperties } from 'react';
import { ButtonPrimary } from '@telefonica/mistica';

type MyPrimaryButtonProps = {
  children: React.ReactNode;
  onPress?: () => void;
  formRef?: RefObject<HTMLFormElement>;
  className?: string;
  style?: CSSProperties;
};

const MyPrimaryButton: React.FC<MyPrimaryButtonProps> = ({
  children,
  onPress,
  formRef,
  className,
  style,
}) => {
  return (
    <ButtonPrimary
      className={className}
      style={style || { width: '100%', marginTop: 16 }}
      onPress={
        onPress
          ? onPress
          : () => {
              const form = formRef?.current || document.querySelector('form');
              form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }
      }
    >
      {children}
    </ButtonPrimary>
  );
};

export default MyPrimaryButton;
