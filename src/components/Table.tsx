import React from "react";
import { Table } from "antd";
import type { TableProps } from "antd";

interface ReusableTableProps<T> {
  data: T[];
  columns: TableProps<T>["columns"];
}

const ReusableTable = <T extends object>({
  data,
  columns,
}: ReusableTableProps<T>) => {
  return <Table columns={columns} dataSource={data} />;
};

export default ReusableTable;
