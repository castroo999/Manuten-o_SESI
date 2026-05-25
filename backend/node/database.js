import { randomUUID } from "node:crypto"

 export class database{
    #orcamentos = new Map()

    list(search) {
        return Array.from(this.#orcamentos.entries())
        .map((orcamentoArray) => {
            const id = orcamentoArray[0]
            const data = orcamentoArray[1]

            return{
                id,
                ...data,
            }
        })
        .filter(orcamento => {
            if(search){
                return orcamento.title.includes(search)
            }
            return true
        })
    }

    create(orcamento){ 
        const orcamentoId = randomUUID()

        this.#orcamentos.set(orcamentoId, orcamento)
    }

    update(id, orcamento){
        this.#orcamentos.set(id, orcamento)
    }

    delete(id){
        this.#orcamentos.delete(id)
    }

}