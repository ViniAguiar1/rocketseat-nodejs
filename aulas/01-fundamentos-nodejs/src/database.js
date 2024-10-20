import fs from 'node:fs/promises';

const databasePath = new URL('../db.json', import.meta.url)

console.log(databasePath);

export class Database {
    #database = {}

    async #persist() {
        try {
            await fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2));  // Usando await para garantir que o arquivo seja gravado
        } catch (error) {
            console.error("Erro ao salvar o arquivo:", error);
        }
    }
    
    select(table) {
        const data = this.#database[table] ?? []
        return data
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])){
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        this.#persist(); 

        return data;
    }
}
