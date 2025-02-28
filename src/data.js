import { faker } from "@faker-js/faker/locale/ru";

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

export const generateClasses = () => {
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

export const prepareTableData = (classes) => {
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
