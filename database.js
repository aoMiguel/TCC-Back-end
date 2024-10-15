import { randomUUID } from "node:crypto"

 export class  DataBaseMemory {
    #pratos = new Map()

    list(search){
        return Array.from(this.#pratos.entries()).map((pratosARRAY)=>{
            const id = pratosARRAY [0]
            const data = pratosARRAY [1]
            return {
                id,
                ...data,
            }
            
        }).filter(pratos =>{
            if(search){
                return pratos.name.includes(search)
            }

            return true
        })
    }
    create(pratos){
        const pratosID = randomUUID()

        this.#pratos.set(pratosID, pratos)
    }

    update(id, pratos){
        this.#pratos.set(id,pratos)
    }
    
    delete(id, pratos){
        this.#pratos.delete(id)
    }


}