import { Table, ConfigProvider, Input } from "antd";
import ru_RU from "antd/locale/ru_RU";
import { useState } from "react";
import { useDebounce } from 'use-debounce';
import "./StudentTable.css";
import  { prepareTableData, generateClasses } from "../../data.js";

function StudentTable () {
  const classes = generateClasses();
  const [searchTerm, setSearchTerm] = useState("");
  // const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  
  const tableData = prepareTableData(classes);
  console.log(tableData)

  // const filteredData = tableData.filter(student => student.fullName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))

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
      sorter: (a, b) => a.fullName.localeCompare(b.fullName)
    },
    {
      title: "Имя",
      dataIndex: "firstName",
      key: "firstName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName)
    },
    {
      title: "Отчество",
      dataIndex: "middleName",
      key: "middleName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName)
    },
    {
      title: "Оценки",
      dataIndex: "grades",
      key: "grades",
      headerStyle: {
        fontSize: "20px", 
        fontWeight: 600 
      },
      render: (grades) => (
        <div>
          {grades.map((item, index) => (
            <div key={index}>
              {item.subject}: {item.grades} (Средний: {item.avg})
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Средний балл",
      dataIndex: "avgGrades",
      key: "avgGrades",
      align: "center",
      sorter: (a, b) => a.avgGrades - b.avgGrades,
      render: (avg) => {
        let color = "";
        if (avg >= 4) color = "green";
        else if (avg >=3) color = "gold";
        else color = "red";
        return (
          <div 
            style={{color}}
            className="avg"
          >
            {avg}
          </div>
        )
      }
    },
  ]
    return(
      <ConfigProvider locale={ru_RU}>
        <Input.Search
          className="inputSearch"
          placeholder="Поиск"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Table
          columns={columns}
          dataSource={tableData}
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