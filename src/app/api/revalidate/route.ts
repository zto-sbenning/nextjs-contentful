import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { tags }: { tags: string[] } = await req.json();
        
        if (!tags || !Array.isArray(tags) || tags.length === 0) {
            return NextResponse.json(
                { error: 'Invalid tags array' },
                { status: 400 }
            );
        }
        
        for (const tag of tags) {
            revalidateTag(tag, "max");
        }
        
        return NextResponse.json({
            revalidated: true,
            tags,
            message: `Revalidation done for ${tags.length} tag(s)`
        }, { status: 200 });
    } catch (error) {
        console.error('Error in revalidate API:', error);
        return NextResponse.json(
            { error: 'Failed to revalidate tags' },
            { status: 500 }
        );
    }
}
