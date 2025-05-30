import { Table, ConfigProvider, Input, Select, Flex } from "antd";
import ru_RU from "antd/locale/ru_RU";
import { useMemo, useState } from "react";
import { useDebounce } from 'use-debounce';
import "./StudentTable.css";
import { tableData, tableColumns } from "../../data";

const baseColumns = [
    {
        title: 'Класс',
        dataIndex: 'className',
        key: 'className',
        sorter: (a, b) => toString(a.className - b.className),
    },
    {
        title: 'ФИО',
        children: [
            { title: 'Фамилия', dataIndex: 'lastName', key: 'lastName' },
            { title: 'Имя', dataIndex: 'firstName', key: 'firstName' },
            { title: 'Отчество', dataIndex: 'middleName', key: 'middleName' }
        ]
    },
    {
        title: 'Средний балл',
        dataIndex: 'GPA',
        key: 'GPA',
        sorter: (a, b) => a.GPA - b.GPA
    }
];


function StudentTable () {
    const [studentsCount, setStudentsCount] = useState(300);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("lastName");
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
    const [debouncedCount] = useDebounce(studentsCount, 300); 
    const data = useMemo(() => tableData(debouncedCount), [debouncedCount]);
    const columns = useMemo(() => [...baseColumns, ...tableColumns], []);
    const filteredData = useMemo(() => {
      if (!debouncedSearchTerm) return data;
        return data.filter(student => 
            student[searchType].toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
      }, [data, debouncedSearchTerm, searchType]
    );

    return(
      <ConfigProvider locale={ru_RU}>
        <Flex justify="space-between" style={{ width: "100%" }}>
          <Flex style={{width: "50%"}}>
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
          </Flex>
          <Input
            style={{
              margin: "10px",
              width: "13%"
            }}
            allowClear
            type="number"
            value={studentsCount}
            onChange={(e) => setStudentsCount(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </Flex>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ 
            pageSize: 10, 
            className: "pagination"
           }}
          rowKey="key"
        />
      </ConfigProvider>
    )
}

export default StudentTable;