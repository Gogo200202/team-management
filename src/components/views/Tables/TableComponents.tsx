import { Box, Table } from "@mui/material";
import Paper from "@mui/material/Paper";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import type { JSX, ReactNode } from "react";

export type ColumnProps<T> = {
  key: string;
  label: string;
  renderColumn?: (value: string) => JSX.Element | string;
  renderRowCell?: (row: T) => JSX.Element | string;
};
type TableProps<T> = {
  columns: ColumnProps<T>[];
  rows: T[];
};

export function TableComponents<T>(
  props: React.PropsWithChildren<TableProps<T>>,
) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ tableLayout: "fixed" }}>
        <TableHead>
          <TableRow>
            {props.columns.map((cl, index) => (
              <TableCell key={index}>{cl.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row, index) => {
            const mapReactNode = new Map<string, ReactNode>();

            Object.entries(row as object).map(([key, value]) => {
              if (typeof value == "object") {
                mapReactNode.set(key, <Box>{value}</Box>);
              } else {
                mapReactNode.set(key, value);
              }
            });

            return (
              <TableRow key={index}>
                {props.columns.map((column, index2) => {
                  if (column.renderRowCell) {
                    return (
                      <TableCell key={index2}>
                        {column.renderRowCell(row)}
                      </TableCell>
                    );
                  } else {
                    return (
                      <TableCell key={index2}>
                        {mapReactNode.get(column.key)}
                      </TableCell>
                    );
                  }
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
