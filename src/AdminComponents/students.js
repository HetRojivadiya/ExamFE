import React, { useEffect } from 'react';
import { useTable, usePagination, useSortBy, useGlobalFilter } from 'react-table';
import { Table, Button } from 'react-bootstrap';
import "./students.css"
import { useState } from 'react';


const columns = [
  {
    Header: 'Profile',
    accessor: 'profileImage', // Update with your actual data field
    Cell: ({ cell: { value } }) => {
      const r = Math.floor(Math.random() * 24) + 1; // Calculate a random number between 1 and 24
      return (
        <img
          src={`/images/avatar/avatar_${r}.jpg`} // Replace with the field containing image URLs
          alt="Profile"
          style={{ width: '40px', borderRadius: '50%' }}
        />
      );
    },
  },
  {
    Header: 'Enrollment',
    accessor: 'enrollment', // Update with your actual data field
  },
  {
    Header: 'GR_No',
    accessor: 'GRno', // Update with your actual data field
  },
  {
    Header: 'First Name',
    accessor: 'firstName',
  },
  {
    Header: 'Last Name',
    accessor: 'lastName',
  },
  {
    Header: 'Email',
    accessor: 'email',
  },
  {
    Header: 'Mobile',
    accessor: 'mobile',
  },
  {
    Header: 'Marks',
    accessor: 'oneMark',
    id: 'marksColumn', // Unique id for the "Marks" column
  },
  {
    Header: 'Performance',
    accessor: 'oneMark',
    id: 'performanceColumn', // Unique id for the "Performance" column
    Cell: ({ cell: { value } }) => {
      let badgeColor;
      let badgeText;

      if (value > 25) {
        badgeColor = 'green';
        badgeText = 'Excellent';
      } else if (value > 15) {
        badgeColor = '#ffc107';
        badgeText = 'Good';
      } else {
        badgeColor = 'red';
        badgeText = 'Poor';
      }

      return (
        <span className="p-1" style={{ color: badgeColor, border: `2px solid ${badgeColor}`, borderRadius: "50px" }}>
          {badgeText}
        </span>
      );
    },
  },
  {
    Header: 'status',
    accessor: 'status', // Update with your actual data field
  },
  {
    Header: 'Action',
    Cell: ({ row }) => {
      const { original } = row;
      if (original.status === 'Attended') {
        return (
          <Button
            onClick={() => handleReAttend(original.enrollment)} // Call your POST request function
            variant="primary"
          >
            Re-Attend
          </Button>
        );
      } else {
        return null; // Display nothing for other statuses
      }
    },
  },
];

const handleReAttend = (studentId) => {

  fetch(`http://localhost:3001/reattend`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ studentId }), 
  })
    .then((response) => {
      if (!response.ok) {
        throw Error('Network response was not ok');
      }else{
        window.location.reload();
      }
      // Handle success or failure as needed
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};


function Students() {

  const [data,setData] = useState([]);

  const studentData = ()=> {
    fetch(`http://localhost:3001/studentData`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      setData(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  }

  useEffect(()=>{
   
    studentData();

  },[]);
  



  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter } = state;

  return (
    <>
    <div className="container-fluid mx-1">
    <div className="table-filter">
    <input
                    type="text"
                    class="form-control bg-light border-2 small"
                    placeholder="Search..."
                    value={globalFilter || ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    aria-label="Search"
                    aria-describedby="basic-addon2"
                  />
      
    </div>
    <Table {...getTableProps()} responsive striped bordered hover className='my-2'>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {page.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
    <div className="d-flex justify-content-end mt-2">
      <Button
        onClick={() => previousPage()}
        disabled={!canPreviousPage}
        className='mx-3'
      >
        Previous
      </Button>{' '}
      <Button
        onClick={() => nextPage()}
        disabled={!canNextPage}
      >
        Next
      </Button>
    </div>
  </div>

  </>
  );
}

export default Students;
