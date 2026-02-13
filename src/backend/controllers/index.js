import { presurePlate } from "../assets/presurePlate/index.js";

export default router => {
    router.get("/:key", presurePlate(ctx => {
        const key = ctx.params.key;
        if (!isNaN(Number(key[0]))) { return key; }
    }));
}