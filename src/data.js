import { faker } from "@faker-js/faker/locale/ru";
import _ from "lodash";

let classJournal = {};

const generateFullName = () => {
    const gender = faker.person.sex();
    return {
        id: faker.string.uuid(),
        firstName: `${faker.person.firstName(gender)}`,
        lastName: `${faker.person.lastName(gender)}`,
        middleName: `${faker.person.middleName(gender)}`,
    }
};

const createNewClass = (classNumber, index) => {
    const literals = ['А', 'Б', 'В', 'Г', 'Д'];
    const className = `${classNumber}${literals[index]}`;
    classJournal[className] = {
        value: 1,
        total: Math.floor(Math.random() * 8) + 23,
    };
    return className;
}

const assignToClass = () => {
    const classNumber = Math.floor(Math.random() * 11) + 1;
    const currentClasses = Object.keys(classJournal).filter(className => parseInt(className) === classNumber);
    let targetClass = currentClasses.at(-1);
    if (!targetClass || classJournal[targetClass].value + 1 > classJournal[targetClass].total) {
        const newClassIndex = currentClasses.length;
        targetClass = createNewClass(classNumber, newClassIndex);
    } else {
        classJournal[targetClass].value += 1;
    }
    return {className: targetClass};    
};

const subjects = {
    junior : ['Букварь', 'Русский язык', 'Литературное чтение', 'Математика', 'Окружающий мир', 'Музыка'],
    middle : ['Русский язык', 'Математика', 'Литература', 'Иностранный язык', 'История', 'Обществознание', "География"],
    high : ['Русский язык', 'Математика', 'Обществознание', 'История', 'Химия', 'Физика', 'Биология']
}

const allSubjects = _.union(subjects.junior, subjects.middle, subjects.high);

const generateSubjects = (classNumber) => {
    const targetSubjects =  
    classNumber <= 4 ?  subjects.junior :
    classNumber <= 7 ?  subjects.middle :
        subjects.high;
    
    const grades = targetSubjects.reduce((acc, subject) => {
        acc[subject] = Array.from({ length: Math.floor(Math.random() * 4) + 3}, () => 
            Math.floor(Math.random() * 4) + 2);
        return acc;
    },{});

    const averageScore = Object.entries(grades).reduce((acc, [subject, marks]) => {
        const sum = marks.reduce((s, mark) => s + mark, 0);
        acc[subject] = marks.length > 0 
            ? Number((sum / marks.length).toFixed(2)) 
            : 0;
        return acc;
    }, {});
    
    const totalSum = Object.values(averageScore).reduce((sum, avg) => sum + avg, 0);
    const GPA = Object.keys(averageScore).length > 0 
        ? Number((totalSum / Object.keys(averageScore).length).toFixed(2)) 
        : 0;

    return {grades, averageScore, GPA};
};

const prepareForTable = (students) => {
    return students.map(student => {
        const row = {
            key: student.id,
            className: student.className,
            lastName: student.lastName,
            firstName: student.firstName,
            middleName: student.middleName,
            GPA: student.GPA
        }

        allSubjects.forEach(subject => {
            row[subject] = student.grades[subject] 
                ? `${student.grades[subject].join(', ')} (${student.averageScore[subject]})` 
                : null;
        });

        return row;
    });
};

const generateStudents = (count) => {
    classJournal = {}; 
    return Array.from({ length: count }, () => {
        const classInfo = assignToClass();
        const classNumber = parseInt(classInfo.className);
        const student = {
            ...generateFullName(),
            ...classInfo,
            ...generateSubjects(classNumber)
        };
        return student;
    });
};

export const tableData = (count) => prepareForTable(generateStudents(count));
export const tableColumns = allSubjects.map(subject => ({
    title: subject,
    dataIndex: subject,
    key: subject,
    render: (value) => value || '-'
}));

