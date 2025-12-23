import Text from "@/design-system/ui/Text";
import fetchRandom from "@/lib/dal/fetchRandom";
import { connection } from "next/server";

export type RamdomProps = {

}

export default async function Random({
}: RamdomProps) {
    await connection();
    const rnd = await fetchRandom();
    return (
        <div className="h-44 flex justify-center items-center flex-col border border-dashed border-neutral-300 rounded-md p-4">
            {/* Random number */}
            <Text as="p" className="mt-4 text-lg text-neutral-700">
                Random number (cached for 1 hour): {rnd}
            </Text>
        </div>
    );
}

export async function RandomSkeleton() {
    return (
        <div className="h-44 flex justify-center items-center flex-col border border-dashed border-neutral-300 rounded-md p-4 animate-pulse">
            {/* Random number */}
            <div className="mt-4 h-6 w-48 bg-neutral-200 rounded-md" />
        </div>
    );
}
