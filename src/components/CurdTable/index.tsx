import React, { useContext } from 'react';
import StandardTable, { StandardTableProps, StandardTableColumnProps } from '../StandardTable/index';
import CurdBox, { CurdBoxProps } from '../CurdBox';
import { addDivider } from '../../utils';
import DataContext from '../../DataContext';

type NoDataStandardTableProps<T> = Omit<StandardTableProps<T>, 'data'>;

export interface CustomStandardTableProps<T> extends NoDataStandardTableProps<T> {
  __curdBox__?: CurdBox<T>;
  columns: StandardTableColumnProps<T>[];
  fetchLoading?: boolean;
}

function CustomStandardTable<T>(props: CustomStandardTableProps<T>) {
  const { __curdBox__, columns, fetchLoading, ...rest } = props;
  const { data } = useContext(DataContext);
  if (__curdBox__) {
    const { handleDataChange } = __curdBox__;
    const enhanceColumns = () => {
      const { actionsConfig } = __curdBox__.props;
      if (!columns) return [];
      if (!actionsConfig) return columns;
      return [
        ...columns,
        {
          title: '操作',
          render: (value, record) => {
            return addDivider(__curdBox__.renderActions(record));
          }
        }
      ];
    };
    return (
      <StandardTable
        {...rest}
        data={data}
        loading={fetchLoading}
        columns={enhanceColumns()}
        onChange={handleDataChange}
      />
    );
  }
  return null;
}

export interface CurdTableProps<T> extends CustomStandardTableProps<T>, CurdBoxProps<T> { }

export default function CurdTable<T>(props: CurdTableProps<T>) {
  return (
    <CurdBox {...props}>
      <CustomStandardTable {...props} />
    </CurdBox>
  );
}
