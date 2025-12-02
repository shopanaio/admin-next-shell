import { Flex } from 'antd';
import { ReactNode } from 'react';

export interface ITableNavigationProps {
  children?: ReactNode;
  className?: string;
}

export const TableNavigation = ({
  children,
  className,
}: ITableNavigationProps) => {
  return (
    <Flex gap="small" align="center" style={{ width: '100%' }} className={className}>
      {children}
    </Flex>
  );
};
