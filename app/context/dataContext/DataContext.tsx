import { createContext } from "react";
//creamos el contexto
const DataContext = createContext({});
//creamos el componente que va a envolver a nuestra aplicación
export const DataProvider = ({ children } :any) => {

    return <DataContext.Provider 
    value={{


    }}>{children}
    </DataContext.Provider>;
}   
//crearchats
//deletechats
//get chats
//update chats
