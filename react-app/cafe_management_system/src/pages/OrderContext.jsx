import React, { createContext, useContext, useReducer } from "react";

// Başlangıç durumu
const initialState = {};

// Reducer fonksiyonu
const orderReducer = (state, action) => {
    switch (action.type) {
        case "ADD_ITEM":
            const { itemName, price } = action.payload;
            return {
                ...state,
                [itemName]: {
                    ...state[itemName],
                    quantity: (state[itemName]?.quantity || 0) + 1,
                    price: price, // Fiyat bilgisini burada saklıyoruz
                },
            };

        case "REMOVE_ITEM":
            const { itemNameToRemove } = action.payload;
            const updatedState = { ...state };
            if (updatedState[itemNameToRemove]) {
                const newQuantity = updatedState[itemNameToRemove].quantity - 0.5;
                if (newQuantity <= 0) {
                    delete updatedState[itemNameToRemove]; // Quantity 0 ise öğe tamamen silinsin
                } else {
                    updatedState[itemNameToRemove].quantity = newQuantity;
                }
            }
            return updatedState;

        case "CLEAR_ORDERS":
            // Tüm siparişleri temizliyoruz
            return {};

        default:
            return state;
    }
};

// Context ve dispatch
const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

// Provider component
export const OrderProvider = ({ children }) => {
    const [orders, dispatch] = useReducer(orderReducer, initialState);

    return (
        <OrderContext.Provider value={{ orders, dispatch }}>
            {children}
        </OrderContext.Provider>
    );
};