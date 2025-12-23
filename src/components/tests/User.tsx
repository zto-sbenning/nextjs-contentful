import Text from "@/design-system/ui/Text";
import fetchData from "@/lib/dal/fetchData";
import Image from "next/image";

export type UserProps = {

};

export default async function User({

}: UserProps) {
    const data = await fetchData();
    const user = data.results[0];
    return (
        <div className="p-4 border border-gray-300 rounded-lg shadow-sm">
            <Image
                src={user.picture.large}
                alt={`${user.name.first} ${user.name.last}`}
                width={96}
                height={96}
                className="rounded-full mx-auto"
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                fetchPriority="high"
                sizes="(max-width: 768px) 96px, 96px"
            />
            <Text as="h2" className="mt-4 text-xl font-semibold text-center">
                {user.name.first} {user.name.last}
            </Text>
            <Text as="p" className="mt-2 text-center text-gray-600">
                {user.email}
            </Text>
            <Text as="p" className="mt-1 text-center text-gray-600">
                {user.location.city}, {user.location.country}
            </Text>
        </div>
    );
}