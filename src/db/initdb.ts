import { Sequelize } from "sequelize";

const db = new Sequelize('sqlite::memory');
console.log('Database connected.');


(async () => {
    await db.sync({ alter : true });
    console.log('All models were synchronized successfully.');
 })();


export default db;