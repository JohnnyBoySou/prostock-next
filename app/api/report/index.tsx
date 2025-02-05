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
const formatDateForLaravel = (date: string | null = null) => {
    if(!date) return null;
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
};
//LISTAGEM COM DATA
export const listReportStore = async (page: number = 1, datac: string, dataf: string) => {
    const c = formatDateForLaravel(datac);
    const f = formatDateForLaravel(dataf);
    try {
        const res = await fetchWithAuth("/usuarios/estatisticas/lojas" + "?page=" + page, {
            method: "GET",
            data: { "datac": c, "dataf": f }
        });
        return res;
    } catch (error: any) {
        throw new Error(error.message);
    }
}
export const listReportProduct = async (id: number, page: number = 1, datac: string, dataf: string) => {
    try {
        const res = await fetchWithAuthOtherStore("/usuarios/estatisticas/produtos" + "?page=" + page + `&datac=${datac}&dataf=${dataf}`, {
            method: "GET",
            headers: { "lojaid": id.toString() }
        });
        return res;
    } catch (error: any) {
        throw new Error(error.message);
    }
}
//SHOW SEM DATA
export const showReportStore = async (id: number, fornecedor_id: string, produto_id: string) => {
    const forn = fornecedor_id != undefined ? "?fornecedor_id=" + fornecedor_id : "";
    try {
        const res = await fetchWithAuth("/usuarios/estatisticas/loja/"+id+forn ,
            {
            method: "GET", 
        });
        return res;
    } catch (error: any) {
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
    } catch (error : any) {
        throw new Error(error.message);
    }
} 
export const showReportSupplier = async (id: number, lojaid: number) => {
    try {
        const res = await fetchWithAuthOtherStore("/usuarios/estatisticas/loja/" + id, {
            method: "GET",
            data: {
                "fornecedor_id": id
            },
            headers: { "lojaid": lojaid.toString() }
        });
        return res;
    } catch (error: any) {
        throw new Error(error.message);
    }
}
export const showReportProductLine = async (produto_id: string, lojaid: number, fornecedor_id: string | null = null, datac: string | null = null, dataf: string | null = null, tab: string) => {
    const type = tab === 'Saída' ? 'saida' : tab == 'Entrada' ? 'entrada' : tab == 'Perdas' ? 'perda' : tab == '' ? '' : tab == 'Devoluções' ? 'devolucao' : 'entrada'
    try {
        const res: any = await fetchWithAuthOtherStore("/usuarios/estatisticas/linechat", {
            method: "GET",
            headers: { "lojaid": lojaid.toString() },
            params: {
                "fornecedor_id": fornecedor_id ? fornecedor_id : '',
                "produto_id": produto_id ? produto_id : '', 
                "datac": datac,
                "dataf":dataf,
                "tipo": type,
            },
        });
        const lineData = res?.data?.map((item: any) => { return { value: parseInt(item?.value), label: item?.label } });
        return {lineData, token: res?.token};
    } catch (error: any) {
        throw new Error(error.message);
    }
}
export const showReportExcel= async (produto_id: string, lojaid: string, fornecedor_id: string, datac: string | null = null, dataf: string | null = null, tab: string, ) => {
    const type = tab === 'Saída' ? 'saida' : tab == 'Entrada' ? 'entrada' : tab == 'Perdas' ? 'perda' : tab == 'Todos' ? '' : 'entrada'
    try {
        const res: any = await fetchWithAuthOtherStore("/usuarios/estatisticas/linechat", {
            method: "GET",
            headers: { "lojaid": lojaid.toString() },
            params: {
                "fornecedor_id": fornecedor_id ? fornecedor_id : '',
                "produto_id": produto_id ? produto_id : '', 
                "datac": datac,
                "dataf":dataf,
                "tipo": type,
            },
        });
        const token = res.token;
        window.open(`https://stock.engenhariadigital.net/api/usuarios/gerarexel?fornecedor_id=${fornecedor_id}&produto_id=${produto_id}&datac=${datac}&dataf=${dataf}&tipo=${type}&lojaid=${lojaid}&token=${token}`, '_blank');
    } catch (error) {
        console.log(error)        
    }
 }
 