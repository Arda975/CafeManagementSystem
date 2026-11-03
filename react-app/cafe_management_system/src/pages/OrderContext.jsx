import React, { createContext, useContext, useReducer } from "react";

// Cart state, keyed by product id: { [productId]: { productId, name, price, quantity } }
const initialState = {};

const orderReducer = (state, action) => {
    switch (action.type) {
        case "ADD_ITEM": {
            const { productId, name, price } = action.payload;
            const current = state[productId];
            return {
                ...state,
                [productId]: { productId, name, price, quantity: (current?.quantity || 0) + 1 },
            };
        }

        case "REMOVE_ITEM": {
            const { productId } = action.payload;
            const current = state[productId];
            if (!current) return state;

            // Immutable update: never change the existing objects in place.
            const next = { ...state };
            if (current.quantity <= 1) {
                delete next[productId];
            } else {
                next[productId] = { ...current, quantity: current.quantity - 1 };
            }
            return next;
        }

        case "CLEAR_ORDERS":
            return {};

        default:
            return state;
    }
};

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    const [orders, dispatch] = useReducer(orderReducer, initialState);

    return (
        <OrderContext.Provider value={{ orders, dispatch }}>
            {children}
        </OrderContext.Provider>
    );
};
