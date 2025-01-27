import { fetchWithAuth, fetchWithNoAuth } from "./api";
import { createToken } from "./token";
import { selectStore } from "./store";

export const loginUser = async (email: string, password: string, session: boolean) => {
    try {
        const res: any  = await fetchWithNoAuth("/auth", { method: "POST", data: { email, password } });
        await createToken(res.token, session);
        await selectStore(res.lojas[0] )
        return res;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
};

export const listUser = async () => {
    try {
        const res = await fetchWithAuth("/usuarios/user", { method: "GET"});
        return res;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
}

export const updateUser = async (params: any) => {
    try {
        const res: any = await fetchWithAuth("/usuarios/user", { method: "PUT", data: params});
        return res.data;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
};

export const excludeUser = async (password: string) => {
    try {
        const res: any = await fetchWithAuth("/usuarios/user", { method: "DELETE", data: {password}});
        return res.data;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
};

