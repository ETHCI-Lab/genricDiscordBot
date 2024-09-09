"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncPatch = exports.asyncPost = exports.asyncGet = void 0;
async function asyncGet(api) {
    try {
        const res = await fetch(api);
        try {
            let data = res.json();
            return data;
        }
        catch (error) {
            console.log(error);
            return error;
        }
    }
    catch (error) {
        console.log(error);
        return error;
    }
}
exports.asyncGet = asyncGet;
async function asyncPost(api, body) {
    const res = await fetch(api, {
        method: 'POST',
        headers: new Headers({
            'content-Type': "application/json"
        }),
        body: body instanceof FormData ? body : JSON.stringify(body),
    });
    try {
        let data = res.json();
        return data;
    }
    catch (error) {
        console.log(error);
    }
}
exports.asyncPost = asyncPost;
async function asyncPatch(api, body) {
    const res = await fetch(api, {
        method: 'PATCH',
        headers: new Headers({
            'Access-Control-Allow-Origin': "http://localhost:5173/",
        }),
        body: body instanceof FormData ? body : JSON.stringify(body),
        mode: "cors"
    });
    try {
        let data = res.json();
        return data;
    }
    catch (error) {
        console.log(error);
    }
}
exports.asyncPatch = asyncPatch;
