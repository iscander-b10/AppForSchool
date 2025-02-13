import { faker } from "@faker-js/faker/locale/ru"

const subjects = ["Русский язык", "Математика", "Литература", "Иностранный язык", "История", "Информатика", "Физкультура"];
const generateStudent = () => ({
  id : faker.string.uuid(),
  fullName : `${faker.person.lastName()} ${faker.person.firstName()} ${faker.person.middleName()}`,
  subjects : subjects.reduce((acc, subject) => {
    acc[subject] = Array.from({ length: 4 }, () => Math.floor(Math.random() * 4) + 2);
    return acc;
  }, {})
})

const generateClasses = () => {
  const classes = [];

  for ( let number = 1; number <= 11; number++) {
    ["А", "Б", "В"].forEach((symbol) => {
      const className = `${number}${symbol}`;
      classes.push({
        name : className
      });
    });
  }
  return classes;
}

const allClasses = generateClasses();
console.log("allClasses",allClasses);

const students = Array.from({ length: 10 }, generateStudent);
console.log("students",students)

function App() {
  return (
    <div>
      hello world
    </div>
  )
}

export default App;
