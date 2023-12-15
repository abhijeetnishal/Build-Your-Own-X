import React, { useEffect, useReducer, useState } from "react";

const dataFetchReducer = (state: any, action: any) => {
    switch (action.type) {
        case "FETCH_INIT":
            return { ...state, isLoading: true, isError: false };
        case "FETCH_SUCCESS":
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload,
            };
        case "FETCH_FAILURE":
            return {
                ...state,
                isLoading: false,
                isError: true,
                error: action.payload,
            };
        default:
            throw new Error();
    }
};

const useApi = (initAction: any, initialData = {}) => {
    const [action, setAction] = useState(() => initAction);


    const [state, dispatch] = useReducer(dataFetchReducer, {
        isLoading: initAction ? true : false,
        isError: false,
        error: {},
        data: initialData,
    });


    useEffect(() => {
        let didCancel = false;


        const fetchData = async () => {
            if (!!action) {
                dispatch({ type: "FETCH_INIT" });
                try {
                    const result = await action();


                    if (!didCancel) {
                        switch (result.code) {
                            case 555:
                            case 200:
                            case 400: {
                                dispatch({
                                    type: "FETCH_SUCCESS",
                                    payload: result,
                                });
                                break;
                            }
                            case -111: {
                                dispatch({ type: "FETCH_SUCCESS", payload: result });
                                break;
                            }
                            case 401: {
                                dispatch({ type: "FETCH_SUCCESS", payload: result });
                                break;
                            }
                            case -222: {
                                dispatch({ type: "FETCH_SUCCESS", payload: result });
                                break;
                            }
                            case -888: {
                                dispatch({ type: "FETCH_FAILURE", payload: result.message });
                                break;
                            }
                            default: {
                                dispatch({ type: "FETCH_FAILURE", payload: result });
                            }
                        }
                    }
                } catch (error) {
                    console.log(error);
                    if (!didCancel) {
                        dispatch({ type: "FETCH_FAILURE", payload: error });
                    }
                }
            }
        };


        fetchData();


        return () => {
            didCancel = true;
        };
    }, [action]);


    return [state, setAction];
};


export default useApi;
