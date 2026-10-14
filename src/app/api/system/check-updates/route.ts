import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
    const user = await getAuthenticatedUser(req);
    if (!user) {
        return NextResponse.json(
            { status: false, message: "Unauthorized", error: "Unauthorized" },
            { status: 401 }
        );
    }

    return NextResponse.json(
        {
            status: false,
            message: "Automatic update checks are unavailable in this build. Install updates manually.",
            error: "UPDATE_CHECK_UNAVAILABLE"
        },
        { status: 503 }
    );
}
