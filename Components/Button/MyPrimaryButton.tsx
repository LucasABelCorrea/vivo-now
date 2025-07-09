import React from 'react';
import { ButtonPrimary } from '@telefonica/mistica';

type MyPrimaryButtonProps = {
  children: React.ReactNode;
  onPress?: () => void;
};

const MyPrimaryButton: React.FC<MyPrimaryButtonProps> = ({ children, onPress }) => {
  return (
    <ButtonPrimary
      onPress={
        onPress
          ? onPress
          : () => {
              document
                .querySelector('form')
                ?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }
      }
      style={{ width: '100%', marginTop: 16 }}
    >
      {children}
    </ButtonPrimary>
  );
};

export default MyPrimaryButton;
