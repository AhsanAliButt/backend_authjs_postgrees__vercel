
import { NextResponse } from "next/server";

export const errorResponse = (message: string, data?: any) => {
    return NextResponse.json({
        success: false,
        error: true,
        message,
        data: data || {},
    });
};

export const successResponse = (data: any, message: string) => {
    return NextResponse.json({
        success: true,
        error: false,
        message,
        data,
    });
}
