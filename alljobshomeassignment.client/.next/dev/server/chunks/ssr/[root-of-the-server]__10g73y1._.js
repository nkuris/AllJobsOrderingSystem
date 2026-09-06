module.exports = [
"[externals]/@reduxjs/toolkit [external] (@reduxjs/toolkit, cjs, [project]/node_modules/@reduxjs/toolkit)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("@reduxjs/toolkit-d78b51d95efcab45", () => require("@reduxjs/toolkit-d78b51d95efcab45"));

module.exports = mod;
}),
"[externals]/axios [external] (axios, esm_import, [project]/node_modules/axios)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
var mod = await __turbopack_context__.y("axios-fc13683ac9a02a51");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/react-redux [external] (react-redux, cjs, [project]/node_modules/react-redux)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("react-redux-12eb2d2ff1e39a2b", () => require("react-redux-12eb2d2ff1e39a2b"));

module.exports = mod;
}),
"[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("react/jsx-dev-runtime", () => require("react/jsx-dev-runtime"));

module.exports = mod;
}),
"[project]/lib/api.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "api",
    ()=>api,
    "default",
    ()=>__TURBOPACK__default__export__,
    "setAccessToken",
    ()=>setAccessToken
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import, [project]/node_modules/axios)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const base = ("TURBOPACK compile-time value", "http://localhost:8080") ?? 'http://localhost:8080';
const api = __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].create({
    baseURL: base
});
// attach token from localStorage if present
api.interceptors.request.use((config)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return config;
});
function setAccessToken(token) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
const __TURBOPACK__default__export__ = api;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/pages/_app.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "default",
    ()=>App
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$react$2d$redux$29$__ = __turbopack_context__.i("[externals]/react-redux [external] (react-redux, cjs, [project]/node_modules/react-redux)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$store$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/store.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$store$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$store$2f$store$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
function App({ Component, pageProps }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$react$2d$redux$29$__["Provider"], {
        store: __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$store$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["store"],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Component, {
            ...pageProps
        }, void 0, false, {
            fileName: "[project]/pages/_app.tsx",
            lineNumber: 9,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/pages/_app.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/store/authSlice.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "login",
    ()=>login,
    "logout",
    ()=>logout,
    "register",
    ()=>register
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$29$__ = __turbopack_context__.i("[externals]/@reduxjs/toolkit [external] (@reduxjs/toolkit, cjs, [project]/node_modules/@reduxjs/toolkit)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const initialState = {
    token: null,
    loading: false,
    error: null
};
const login = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$29$__["createAsyncThunk"])('auth/login', async (req)=>{
    const res = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].post('/api/auth/login', req);
    return res.data;
});
const register = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$29$__["createAsyncThunk"])('auth/register', async (req)=>{
    const res = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].post('/api/auth/register', req);
    return res.data;
});
const slice = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$29$__["createSlice"])({
    name: 'auth',
    initialState,
    reducers: {
        logout (state) {
            state.token = null;
            state.userId = undefined;
            state.email = undefined;
            state.role = undefined;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["setAccessToken"])(null);
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(login.pending, (state)=>{
            state.loading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action)=>{
            state.loading = false;
            state.token = action.payload.accessToken;
            state.userId = action.payload.userId;
            state.email = action.payload.email;
            state.role = action.payload.role;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["setAccessToken"])(action.payload.accessToken);
        });
        builder.addCase(login.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.error.message ?? 'Login failed';
        });
        builder.addCase(register.pending, (state)=>{
            state.loading = true;
            state.error = null;
        });
        builder.addCase(register.fulfilled, (state)=>{
            state.loading = false;
        });
        builder.addCase(register.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.error.message ?? 'Register failed';
        });
    }
});
const { logout } = slice.actions;
const __TURBOPACK__default__export__ = slice.reducer;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/store/ordersSlice.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "createOrder",
    ()=>createOrder,
    "default",
    ()=>__TURBOPACK__default__export__,
    "fetchOrders",
    ()=>fetchOrders
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$29$__ = __turbopack_context__.i("[externals]/@reduxjs/toolkit [external] (@reduxjs/toolkit, cjs, [project]/node_modules/@reduxjs/toolkit)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const fetchOrders = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$29$__["createAsyncThunk"])('orders/fetch', async (status)=>{
    const url = status ? `/api/orders?status=${encodeURIComponent(status)}` : '/api/orders';
    const res = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].get(url);
    return res.data;
});
const createOrder = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$29$__["createAsyncThunk"])('orders/create', async (req)=>{
    const res = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].post('/api/orders', req);
    return res.data;
});
const slice = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$29$__["createSlice"])({
    name: 'orders',
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder)=>{
        builder.addCase(fetchOrders.pending, (state)=>{
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchOrders.fulfilled, (state, action)=>{
            state.items = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchOrders.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.error.message ?? 'Failed';
        });
        builder.addCase(createOrder.pending, (state)=>{
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createOrder.fulfilled, (state, action)=>{
            state.items.unshift(action.payload);
            state.loading = false;
        });
        builder.addCase(createOrder.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.error.message ?? 'Failed';
        });
    }
});
const __TURBOPACK__default__export__ = slice.reducer;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/store/productsSlice.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "fetchProducts",
    ()=>fetchProducts
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$29$__ = __turbopack_context__.i("[externals]/@reduxjs/toolkit [external] (@reduxjs/toolkit, cjs, [project]/node_modules/@reduxjs/toolkit)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import, [project]/node_modules/axios)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const fetchProducts = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$29$__["createAsyncThunk"])('products/fetch', async ()=>{
    const base = ("TURBOPACK compile-time value", "http://localhost:8080") ?? 'http://localhost:8080';
    const res = await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${base}/api/products`);
    return res.data;
});
const productsSlice = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$29$__["createSlice"])({
    name: 'products',
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder)=>{
        builder.addCase(fetchProducts.pending, (state)=>{
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchProducts.fulfilled, (state, action)=>{
            state.items = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchProducts.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.error.message ?? 'Failed';
        });
    }
});
const __TURBOPACK__default__export__ = productsSlice.reducer;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/store/store.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "store",
    ()=>store
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$29$__ = __turbopack_context__.i("[externals]/@reduxjs/toolkit [external] (@reduxjs/toolkit, cjs, [project]/node_modules/@reduxjs/toolkit)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$productsSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/productsSlice.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$authSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/authSlice.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$ordersSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/ordersSlice.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$usersSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/usersSlice.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$productsSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$authSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$ordersSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$usersSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$store$2f$productsSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$authSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$ordersSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$usersSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
const store = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$29$__["configureStore"])({
    reducer: {
        products: __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$productsSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"],
        auth: __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$authSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"],
        orders: __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$ordersSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"],
        users: __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$usersSlice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
    }
});
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/store/usersSlice.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "deleteUser",
    ()=>deleteUser,
    "fetchUsers",
    ()=>fetchUsers,
    "updateUserRole",
    ()=>updateUserRole
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$29$__ = __turbopack_context__.i("[externals]/@reduxjs/toolkit [external] (@reduxjs/toolkit, cjs, [project]/node_modules/@reduxjs/toolkit)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const fetchUsers = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$29$__["createAsyncThunk"])('users/fetch', async ()=>{
    const res = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].get('/api/users');
    return res.data;
});
const updateUserRole = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$29$__["createAsyncThunk"])('users/updateRole', async ({ id, role })=>{
    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].put(`/api/users/${id}/role`, {
        role
    });
    return {
        id,
        role
    };
});
const deleteUser = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$29$__["createAsyncThunk"])('users/delete', async (id)=>{
    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].delete(`/api/users/${id}`);
    return id;
});
const slice = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$29$__["createSlice"])({
    name: 'users',
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder)=>{
        builder.addCase(fetchUsers.pending, (state)=>{
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchUsers.fulfilled, (state, action)=>{
            state.items = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchUsers.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.error.message ?? 'Failed';
        });
        builder.addCase(updateUserRole.fulfilled, (state, action)=>{
            const u = state.items.find((x)=>x.id === action.payload.id);
            if (u) u.role = action.payload.role;
        });
        builder.addCase(deleteUser.fulfilled, (state, action)=>{
            state.items = state.items.filter((x)=>x.id !== action.payload);
        });
    }
});
const __TURBOPACK__default__export__ = slice.reducer;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__10g73y1._.js.map