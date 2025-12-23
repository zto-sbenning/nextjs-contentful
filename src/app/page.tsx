import Image from "next/image";
import Text from "@/design-system/ui/Text";
import fetchData from "@/lib/dal/fetchData";
import fetchRandom from "@/lib/dal/fetchRandom";
import Boundary from "@/components/internal/Boundary";
import Random, { RandomSkeleton } from "@/components/tests/Random";
import User from "@/components/tests/User";
import { Suspense } from "react";

/**
 * 
 * { "results": [ { "gender": "male", "name": { "title": "Mr", "first": "Philippe", "last": "Roy" }, "location": { "street": { "number": 9441, "name": "Pine Rd" }, "city": "Bath", "state": "Northwest Territories", "country": "Canada", "postcode": "Y7U 0Q0", "coordinates": { "latitude": "-70.7229", "longitude": "-143.8104" }, "timezone": { "offset": "+3:00", "description": "Baghdad, Riyadh, Moscow, St. Petersburg" } }, "email": "philippe.roy@example.com", "login": { "uuid": "cc8fb069-6a01-4ac5-8991-2d6a50a5559f", "username": "purplebutterfly250", "password": "mandingo", "salt": "yPaeQWuH", "md5": "b98c326ebd9040e3693e3b83972c9fbf", "sha1": "91d03322ff39e0d08521c6c9f5d12eb8331098b3", "sha256": "6a8fd96a2aa53c7ba4e705eaa42903b89481d0ddf9c24aa3d899f386e4d2cffc" }, "dob": { "date": "1992-11-25T06:18:54.290Z", "age": 33 }, "registered": { "date": "2010-01-03T22:34:40.032Z", "age": 15 }, "phone": "J06 I33-6968", "cell": "R43 Y28-1974", "id": { "name": "SIN", "value": "943770909" }, "picture": { "large": "https://randomuser.me/api/portraits/men/67.jpg", "medium": "https://randomuser.me/api/portraits/med/men/67.jpg", "thumbnail": "https://randomuser.me/api/portraits/thumb/men/67.jpg" }, "nat": "CA" } ], "info": { "seed": "097f0df419e42c3c", "results": 1, "page": 1, "version": "1.4" } }
 */
export default async function Home() {
    return (
        <main className="flex flex-1 flex-col p-24">
            <Text as="h1" className="text-4xl leading-loose font-bold text-neutral-900">
                Welcome to Next.js!
            </Text>
            {/* Random number */}
            <Boundary hydration="server" rendering="dynamic">
                <Suspense fallback={<RandomSkeleton />}>
                    <Random />
                </Suspense>
            </Boundary>
            {/** User cards */}
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Boundary hydration="server" rendering="hybrid" cached>
                    <User />
                </Boundary>
            </div>
        </main>
    );
}
