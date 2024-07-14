import { Sequelize } from "sequelize";

export const db = new Sequelize('sqlite::memory');
console.log('Database connected.');
(async () => {
    await db.sync({ force: true });
    console.log('All models were synchronized successfully.');
 })();


export default db;