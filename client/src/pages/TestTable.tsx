import React from 'react';
import { Table, type Column } from '../components/grid/Table';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
}

const mockData: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'Inactive' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'Active' },
];

const TestTable: React.FC = () => {
  const columns: Column<User>[] = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {row.status}
        </span>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-bg-base p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
           <h1 className="text-2xl font-bold mb-4">Table Component Test</h1>
           <p className="text-text-muted mb-8">Resize the window to see responsiveness.</p>
        </div>

        <Table 
          data={mockData} 
          columns={columns} 
          keyExtractor={(row) => row.id}
          onRowClick={(row) => alert(`Clicked ${row.name}`)}
        />
      </div>
    </div>
  );
};

export default TestTable;
