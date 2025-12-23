import { cacheLife, cacheTag, unstable_cache } from "next/cache";
import sleep from "../utils/sleep";

async function __fetchRandom() {
    /*
    "use cache";
    cacheTag('random-random-data');
    cacheLife({ revalidate: 3600 }); // 1 hour
    */
    return Math.random();
}

/*
const _fetchRandom = unstable_cache(
    __fetchRandom,
    [
        "random"
    ],
    {
        revalidate: 3600, // 1 hour
        tags: ['random-random-data'],
    }
);
*/

export default async function fetchRandom() {
    await sleep(2000);
    return __fetchRandom();
}