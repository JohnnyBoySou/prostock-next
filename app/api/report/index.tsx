import { fetchWithAuth, fetchWithAuthOtherStore } from "@/hooks/api";

interface Report extends Record<string, unknown> {
    tipo: string;
    quantidade: number;
    preco: number;
    produto_id: number;
    fornecedor_id: number;
    lote: string;
    validade: string;
    observacoes: string;
}

export const listReportStore = async (page: number = 1) => {
    try {
        const res = await fetchWithAuth("/usuarios/estatisticas/lojas" + "?page=" + page, {
            method: "GET", 
        });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}


export const showReportStore = async (id: number) => {
    try {
        const res = await fetchWithAuth("/usuarios/estatisticas/loja/" + id, {
            method: "GET", 
        });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}
export const listReportProduct = async (page: number = 1) => {
    try {
        const res = await fetchWithAuth("/usuarios/estatisticas/produtos" + "?page=" + page, {
            method: "GET", 
         });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const showReportProduct = async (id: number, lojaid: number) => {
    try {
        const res = await fetchWithAuthOtherStore("/usuarios/estatisticas/produto/" + id, {
            method: "GET", 
            headers: { "lojaid": lojaid.toString() }
        });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}
