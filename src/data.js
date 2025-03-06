import { faker } from "@faker-js/faker/locale/ru";

const subjects = ["Русский язык", "Математика", "Литература", "Иностранный язык", "История", "Информатика", "Физкультура"];

const generateStudent = (className) => {
  const grades = subjects.reduce((acc, subject ) => {
    acc[subject] = Array.from({ length: 4 }, () => Math.floor(Math.random() * 4) + 2);
    return acc;
  }, {});
  
  const avg = Object.entries(grades).reduce((acc, [subject, marks]) => {
    acc[subject] = marks.reduce((sum, mark) => sum + mark, 0) / marks.length;
    return acc;
  }, {})

  const avgGrades = Object.values(avg).flat().reduce((sum, average) => sum + average, 0) / Object.keys(avg).length;

  const gender = faker.person.sex();
  
  return{
    id: faker.string.uuid(),
    firstName: `${faker.person.firstName(gender)}`,
    lastName: `${faker.person.lastName(gender)}`,
    middleName: `${faker.person.middleName(gender)}`,
    className,
    grades,
    avg,
    avgGrades: Number(avgGrades.toFixed(2))
  }
}

export const generateClasses = () => {
  const classes = [];

  for ( let number = 1; number <= 11; number++) {
    ["А", "Б", "В"].forEach((symbol) => {
      const className = `${number}${symbol}`;
      const students = Array.from({ length : 2 }, () => generateStudent(className));
      classes.push({
        className,
        students
      });
    });
  }
  return classes;
}

export const prepareTableData = (classes) => {
  return classes.flatMap(classItem => 
    classItem.students.map(student => {

      return {
        ...student,
        key: student.id,
      };
    })
  );
};

