'use cache' // ← Une seule fois pour tout le fichier
import { cacheLife, cacheTag } from "next/cache";

export default async function fetchData() {
    cacheTag('user-random-data');
    cacheLife('user-data'); // ← Utilise le profile défini dans next.config.ts
    const result = await fetch('https://randomuser.me/api/');
    return result.json();
}

export async function fetchWithCache(url: string) {
    cacheTag('mon-tag');
    cacheLife('api-data'); // ← Nom du profile au lieu d'objet inline
    const response = await fetch(url);
    return response.json();
}
