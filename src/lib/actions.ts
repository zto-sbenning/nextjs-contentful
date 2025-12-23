import { revalidateTag } from "next/cache";

export async function revalidateNextTag(tag: string) {
    revalidateTag(tag, "max");
}