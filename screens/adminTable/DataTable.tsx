"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type User = {
  id: string;
  fullname: string;
  email: string;
  password: string;
  role: string;
  verified: Date | null;
  isAccess: boolean;
  congratsEmailSent: boolean;
};


const handleDelete = (userId: string) => {
  console.log("Deleting user with ID:", userId);
  
  fetch(`https://ahsan-ali-franciso-backend.vercel.app/delete-user/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => console.log("User deleted successfully:", data))
    .catch((error) => console.error("Error deleting user:", error));
};
// Updated columns for User data
export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        contentEditable="true"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "fullname",
    header: () => "Full Name",
    cell: ({ row }) => <div>{row.getValue("fullname")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: () => "Role",
    cell: ({ row }) => <div>{row.getValue("role")}</div>,
  },
  {
    accessorKey: "verified",
    header: () => "Verified",
    cell: ({ row }) => (
      <div>{row.getValue("verified") ? "true" : "false"}</div>
    ),
  },
  {
    accessorKey: "isAccess",
    header: () => "Access",
    cell: ({ row }) => <div>{row.getValue("isAccess") ? "true" : "false"}</div>,
  },
    {
    accessorKey: "congratsEmailSent",
    header: () => "Congrats Email Sent",
    cell: ({ row }) => <div>{row.getValue("congratsEmailSent") ? "true" : "false"}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem>Update</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(user.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const DataTableDemo = ({ users }: { users: User[] }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: users, // Use the users prop passed from the parent component
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });


  //   <div className="w-full">
  //     <div className="flex items-center py-4">
  //       <Input
  //         placeholder="Filter emails..."
  //         value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
  //         onChange={(event) =>
  //           table.getColumn("email")?.setFilterValue(event.target.value)
  //         }
  //         className="max-w-sm"
  //       />
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="outline" className="ml-auto">
  //             Columns <ChevronDown className="ml-2 h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           {table
  //             .getAllColumns()
  //             .filter((column) => column.getCanHide())
  //             .map((column) => {
  //               return (
  //                 <DropdownMenuCheckboxItem
  //                   key={column.id}
  //                   className="capitalize"
  //                   checked={column.getIsVisible()}
  //                   onCheckedChange={(value) =>
  //                     column.toggleVisibility(!!value)
  //                   }
  //                 >
  //                   {column.id}
  //                 </DropdownMenuCheckboxItem>
  //               );
  //             })}
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     </div>
  //     <div className="rounded-md border">
  //       <Table>
  //         <TableHeader>
  //           {table.getHeaderGroups().map((headerGroup) => (
  //             <TableRow key={headerGroup.id}>
  //               {headerGroup.headers.map((header) => {
  //                 return (
  //                   <TableHead key={header.id}>
  //                     {header.isPlaceholder
  //                       ? null
  //                       : flexRender(
  //                           header.column.columnDef.header,
  //                           header.getContext()
  //                         )}
  //                   </TableHead>
  //                 );
  //               })}
  //             </TableRow>
  //           ))}
  //         </TableHeader>
  //         <TableBody>
  //           {table.getRowModel().rows?.length ? (
  //             table.getRowModel().rows.map((row) => (
  //               <TableRow
  //                 key={row.id}
  //                 data-state={row.getIsSelected() && "selected"}
  //               >
  //                 {row.getVisibleCells().map((cell) => (
  //                   <TableCell key={cell.id}>
  //                     {flexRender(
  //                       cell.column.columnDef.cell,
  //                       cell.getContext()
  //                     )}
  //                   </TableCell>
  //                 ))}
  //               </TableRow>
  //             ))
  //           ) : (
  //             <TableRow>
  //               <TableCell
  //                 colSpan={columns.length}
  //                 className="h-24 text-center"
  //               >
  //                 No results.
  //               </TableCell>
  //             </TableRow>
  //           )}
  //         </TableBody>
  //       </Table>
  //     </div>
  //     <div className="flex items-center justify-end space-x-2 py-4">
  //       <div className="flex-1 text-sm text-muted-foreground">
  //         {table.getFilteredSelectedRowModel().rows.length} of{" "}
  //         {table.getRowModel().rows.length} row(s) selected.
  //       </div>
  //       <Button
  //         variant="outline"
  //         size="sm"
  //         onClick={() => table.previousPage()}
  //         disabled={!table.getCanPreviousPage()}
  //       >
  //         Previous
  //       </Button>
  //       <Button
  //         variant="outline"
  //         size="sm"
  //         onClick={() => table.nextPage()}
  //         disabled={!table.getCanNextPage()}
  //       >
  //         Next
  //       </Button>
  //     </div>
  //   </div>
  // );
return (
  <div className="w-full">
    {/* Filter & Dropdown */}
    <div className="flex flex-wrap items-center gap-2 py-4">
      <Input
        placeholder="Filter emails..."
        value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("email")?.setFilterValue(event.target.value)
        }
        className="max-w-sm w-full md:w-auto"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto w-full md:w-auto">
            Columns <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) =>
                  column.toggleVisibility(!!value)
                }
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    {/* Scrollable Table Container */}
    <div className="rounded-md border overflow-x-auto">
      <div className="w-full min-w-[800px]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-sm p-2">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-sm p-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>

    {/* Pagination */}
    <div className="flex flex-wrap items-center justify-between space-x-2 py-4 text-sm">
      <div className="text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="w-full sm:w-auto"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="w-full sm:w-auto"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
);
}

export default DataTableDemo;
