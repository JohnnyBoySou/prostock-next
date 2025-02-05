'use client';
import React, { useState, useRef } from "react";
import { importProduct } from "../api/product";
import { importSupplier } from "../api/supplier";
import { Button } from "../../components/ui/button";

export default function ImportData(store) {

    const [success, setsuccess] = useState();
    const [error, seterror] = useState();
    const [type, settype] = useState('PRODUTO');
    const fileInputRef = useRef(null);

    const handleFileChange = async (event) => {
        seterror('')
        setsuccess('')
        const file = event.target.files[0];
        if (file && (
            file.type === 'text/csv'
        )) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64 = e.target.result.split(',')[1];
                try {
                    if (type === 'PRODUTO') {
                        const res = await importProduct(store, base64);
                        setsuccess(res.message);
                    } else {
                        const res = await importSupplier(store, base64);
                        setsuccess(res.message);
                    }
                } catch (error) {
                    console.error('Erro ao importar o arquivo:', error);
                    seterror('Falha ao importar o arquivo.');
                }
            };
            reader.readAsDataURL(file);
        } else {
            seterror('Por favor, selecione um arquivo Excel válido (.xls ou .xlsx)');
        }
    };
    const handleDownloadTemplate = () => {
        const link = document.createElement('a');
        link.href = type === 'PRODUTO' ? '/modelo_produtos.csv' : '/modelo_fornecedores.csv'; // Caminho do arquivo modelo
        link.download =  type === 'PRODUTO' ? '/modelo_produtos.csv' : '/modelo_fornecedores.csv';
        link.click();
    };

    return (
        <div className=" flex justify-center items-center">
            <div className="container mx-auto space-y-6 rounded-lg flex flex-col items-center">
                <div className="items-center justify-center flex flex-col">
                    <h1 className="text-2xl font-bold text-center">Importar produtos ou fornecedores</h1>
                    <span className="text-center opacity-70">Selecione o tipo de importação que deseja fazer</span>
               </div>
                <div className="flex flex-row gap-4 justify-center">
                    <Button className={type === 'PRODUTO' ? `bg-[#019866] text-white hover:bg-[#019866]`: `bg-[#01986640] text-[#019866] hover:bg-[#019866] hover:text-white`} onClick={() => settype('PRODUTO')}>PRODUTOS</Button>
                    <Button className={type === 'FORNECEDOR' ? `bg-[#019866] text-white hover:bg-[#019866] hover:text-white`: `bg-[#01986640] hover:text-white text-[#019866] hover:bg-[#019866]`} onClick={() => settype('FORNECEDOR')}>FORNECEDORES</Button>
                </div>
                <form className="flex flex-col items-center gap-2 w-full border-dotted border-[#3590F3] border-2 p-6 rounded-lg bg-[#3590f310]">
                    <button type="button" className="border-[#3590F3]  mt-4 border-2  text-[#3590f3] px-6 py-2 rounded-lg" onClick={() => fileInputRef.current.click()}>Selecionar arquivo</button>
                    <input
                        type="file"
                        accept=".csv"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                    <span className="text-center opacity-70 mt-4">Arquivos aceitos: .csv</span>
                    <span onClick={handleDownloadTemplate} className="text-center text-[#3590F3] cursor-pointer underline">Baixar modelo</span>
                </form>
                <div className="text-center 3">
                    {success && <p className="text-green-500 bg-green-500/20 p-4 rounded-sm mb-3">{success}</p>}
                    {error && <p className="text-red-500 bg-red-500/20 p-4 rounded-sm mb-3">{error}</p>}
                </div>
            </div>
        </div>
    )
}