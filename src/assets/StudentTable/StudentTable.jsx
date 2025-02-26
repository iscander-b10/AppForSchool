import { Table, ConfigProvider, Input } from "antd"
import ru_RU from "antd/locale/ru_RU"
import { faker } from "@faker-js/faker/locale/ru"
import { useState } from "react";
import { useDebounce } from 'use-debounce';

const subjects = ["Русский язык", "Математика", "Литература", "Иностранный язык", "История", "Информатика", "Физкультура"];

const generateStudent = (className) => {
  const grades = subjects.reduce((acc, assessment ) => {
    acc[assessment] = Array.from({ length: 4 }, () => Math.floor(Math.random() * 4) + 2);
    return acc;
  }, {});
  
  const avg = Object.entries(grades).reduce((acc, [subject, marks]) => {
    acc[subject] = marks.reduce((sum, mark) => sum + mark, 0) / marks.length;
    return acc;
  }, {})

  const avgGrades = Object.values(avg).flat().reduce((sum, average) => sum + average, 0) / Object.keys(avg).length;
  
  return{
    id: faker.string.uuid(),
    fullName: `${faker.person.lastName()} ${faker.person.firstName()} ${faker.person.middleName()}`,
    className,
    grades,
    avg,
    avgGrades: Number(avgGrades.toFixed(2))
  }
}

const generateClasses = () => {
  const classes = [];

  for ( let number = 1; number <= 11; number++) {
    ["А", "Б", "В"].forEach((symbol) => {
      const className = `${number}${symbol}`;
      const students = Array.from({ length : 15 }, () => generateStudent(className));
      classes.push({
        className,
        students
      });
    });
  }
  return classes;
}

//Преобразование данных для таблицы
const prepareTableData = (classes) => {
  return classes.flatMap(classItem => 
    classItem.students.map(student => ({
      ...student,
      key: student.id,
      grades: Object.entries(student.grades).map(([subject, grades]) => ({
        subject,
        grades: grades.join(', '),
        avg: student.avg[subject]
      }))
    })
  ))
};

function StudentTable () {
  const classes = generateClasses();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  
  const tableData = prepareTableData(classes);

  const filteredData = tableData.filter(student => student.fullName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))

  const columns = [
    {
      title: "Класс",
      dataIndex: "className",
      key: "className",
      filters: Array.from(new Set(tableData.map(item => item.className))).map(c => ({text: c, value: c})),
      onFilter: (value, record) => record.className === value,
    },
    {
      title: "ФИО",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName)
    },
    {
      title: "Оценки",
      dataIndex: "grades",
      key: "grades",
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
      sorter: (a, b) => a.avgGrades - b.avgGrades
    },
  ]
    return(
      <ConfigProvider locale={ru_RU}>
        <Input.Search
          placeholder="Поиск по ФИО"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 45 }}
          rowKey="key"
        />
      </ConfigProvider>
    )
}

export default StudentTable;