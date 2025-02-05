import { createContext, useState, useEffect } from "react";
import { api } from "../lib/axios";

interface Transaction {

    id: number;
    description: string;
    type: 'income' | 'outcome';
    price: number;
    category: string;
    createdAt: string;
}

interface TransactionContextType {
    transactions: Transaction[];
    fetchTransactions: (query?: string) => Promise<void>;
    createTransaction: (data: CreateTransactionInput) => Promise<void>;
}

interface TransactionsProviderProps {
    children: React.ReactNode;
}

interface CreateTransactionInput {
    description: string;
    price: number;
    category: string;
    type: 'income' | 'outcome';
}

export const TransactionsContext = createContext({} as TransactionContextType);


export function TransactionsProvider({ children }: TransactionsProviderProps) {

    const [transactions, setTransactions] = useState<Transaction[]>([]);

    async function fetchTransactions(query?: string) {
        const response = await api.get('/transactions', {
            params: {
                _sort: 'createdAt',
                _order: 'desc',
                q: query,
            }
        })
        console.log(response);
        setTransactions(response.data);

    }

    async function createTransaction(data: CreateTransactionInput) {
        const { category, description, price, type } = data;

        const response = await api.post('transactions', {
            category,
            description,
            price,
            type,
            createdAt: new Date(),
        })
        setTransactions([...transactions, response.data]);
    }

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <TransactionsContext.Provider value={{
            transactions,
            fetchTransactions,
            createTransaction,
        }}>
            {children}
        </TransactionsContext.Provider>
    )
}