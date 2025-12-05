import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const addToCart = createAsyncThunk("cart/addToCart", async () => {});
export const rermoveCart = createAsyncThunk("rermoveCart", async () => {});


const shopingCartSlice=createSlice({
    name:"cart",
    initialState:{
        
    }
})