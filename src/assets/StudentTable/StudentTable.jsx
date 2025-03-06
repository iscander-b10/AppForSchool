import { Table, ConfigProvider, Input, Select } from "antd";
import ru_RU from "antd/locale/ru_RU";
import { useMemo, useState } from "react";
import { useDebounce } from 'use-debounce';
import "./StudentTable.css";
import  { prepareTableData, generateClasses } from "../../data.js";

function StudentTable () {
  const classes = useMemo(() => generateClasses(), []);
  const tableData = useMemo(() => prepareTableData(classes), [classes]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("lastName");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  
  const filteredData = useMemo(() => {
    if (!debouncedSearchTerm) return tableData;
    return tableData.filter(student => {
      const searchField = student[searchType].toLowerCase();
      return searchField.includes(debouncedSearchTerm.toLowerCase());
    });
  },  [tableData, debouncedSearchTerm, searchType]);

  
  tableData.filter(student => {
    const searchField = student[searchType].toLowerCase();
    return searchField.includes(debouncedSearchTerm.toLowerCase());
  });
  
  const columns = [
    {
      title: "Класс",
      dataIndex: "className",
      key: "className",
      headerStyle: {
        fontSize: "20px", 
        fontWeight: 600 
      },
      filters: Array.from(new Set(tableData.map(item => item.className))).map(c => ({text: c, value: c})),
      onFilter: (value, record) => record.className === value,
    },
    {
      title: "Фамилия",
      dataIndex: "lastName",
      key: "lastName",
      sorter: (a, b) => a.lastName.localeCompare(b.lastName)
    },
    {
      title: "Имя",
      dataIndex: "firstName",
      key: "firstName",
      sorter: (a, b) => a.firstName.localeCompare(b.firstName)
    },
    {
      title: "Отчество",
      dataIndex: "middleName",
      key: "middleName",
      sorter: (a, b) => a.middleName.localeCompare(b.middleName)
    },
    // {
    //   title: "Оценки",
    //   dataIndex: "grades",
    //   key: "grades",
    //   headerStyle: {
    //     fontSize: "20px", 
    //     fontWeight: 600 
    //   },
    //   render: (grades) => (
    //     <div>
    //       {grades.map((item, index) => (
    //         <div key={index}>
    //           {item.subject}: {item.grades} (Средний: {item.avg})
    //         </div>
    //       ))}
    //     </div>
    //   )
    {
      title: "Средний балл",
      dataIndex: "avgGrades",
      key: "avgGrades",
      align: "center",
      sorter: (a, b) => a.avgGrades - b.avgGrades,
      render: (avgGrades) => {
        let color = "";
        if (avgGrades >= 4) color = "green";
        else if (avgGrades >=3) color = "gold";
        else color = "red";
        return (
          <div 
            style={{color}}
            className="avg"
          >
            {avgGrades}
          </div>
        )
      }
    },
  ];

    return(
      <ConfigProvider locale={ru_RU}>
        <Select
          style={{
            margin: "10px",
            width: "200px"
          }}
          defaultValue="lastName"
          onChange={value => setSearchType(value)}
          options={[
            {value: "lastName", label: "Поиск по фамилии"},
            {value: "firstName", label: "Поиск по имени"},
            {value: "middleName", label: "Поиск по отчеству"}
          ]}
        />
        <Input.Search
          className="inputSearch"
          placeholder="Поиск"
          allowClear
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ 
            pageSize: 45, 
            className: "pagination"
           }}
          rowKey="key"
        />
      </ConfigProvider>
    )
}

export default StudentTable;