import { Table, ConfigProvider, Input, Select, Flex, Spin } from "antd";
import ru_RU from "antd/locale/ru_RU";
import { useMemo, useState, useEffect } from "react"; 
import { useDebounce } from 'use-debounce';
import "./StudentTable.css";
import { tableData, tableColumns } from "../../data";

const baseColumns = [
    {
        title: 'Класс',
        dataIndex: 'className',
        key: 'className',
        align: 'center',
    },
    {
        title: 'ФИО',
        children: [
            { title: 'Фамилия', dataIndex: 'lastName', key: 'lastName', align: 'center',},
            { title: 'Имя', dataIndex: 'firstName', key: 'firstName', align: 'center', },
            { title: 'Отчество', dataIndex: 'middleName', key: 'middleName', align: 'center', }
        ]
    },
    {
        title: 'Средний балл',
        dataIndex: 'GPA',
        key: 'GPA',
        sorter: (a, b) => a.GPA - b.GPA,
        align: 'center',
    }
];

function StudentTable () {
    const [studentsCount, setStudentsCount] = useState(300);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("className");
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
    const [debouncedCount] = useDebounce(studentsCount, 300); 
    
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        setLoading(true);
        
        const timer = setTimeout(() => {
            const generatedData = tableData(debouncedCount);
            setData(generatedData);
            setLoading(false);
        }, 1000); 

        return () => clearTimeout(timer); 
    }, [debouncedCount]);

    const columns = useMemo(() => [
      ...baseColumns, 
      ...tableColumns.map(col => ({
        ...col,
        align: 'center',
        render: (text) => <div className="no-wrap-cell">{text || '-'}</div>
      }))
    ], []);

    const filteredData = useMemo(() => {
      if (!debouncedSearchTerm) return data;
        return data.filter(student => 
            student[searchType].toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
      }, [data, debouncedSearchTerm, searchType]
    );

    return(
      <ConfigProvider locale={ru_RU}>
        <Spin spinning={loading} tip="Загрузка данных..." size="large">
          <Flex justify="space-between" style={{ width: "100%" }}>
            <Flex style={{width: "50%"}}>
              <Select
                style={{
                  margin: "10px",
                  width: "200px"
                }}
                defaultValue="className"
                onChange={value => setSearchType(value)}
                options={[
                  {value: "className", label: "Поиск по классу"},
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
            className="strict-table"
            columns={columns}
            dataSource={filteredData}
            pagination={{ 
              pageSize: 10, 
              className: "pagination"
             }}
            rowKey="key"
          />
        </Spin>
      </ConfigProvider>
    )
}

export default StudentTable;