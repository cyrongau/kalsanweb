import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
    const params = await props.params;
    // Use backend URL from env, default back to localhost
    const backendUrl = process.env.INTERNAL_API_URL || 'http://backend:3001';

    // Reconstruct path
    // path is an array of segments, e.g. ['products']
    // But wait, params access is async in Next 15+?
    // In Next 14, params is an object.
    // Next 13 App Router params: { path: string[] }

    try {
        const path = params.path ? params.path.join('/') : '';
        const searchParams = req.nextUrl.searchParams.toString();
        const url = `${backendUrl}/${path}${searchParams ? '?' + searchParams : ''}`;

        console.log(`[Proxy] Forwarding ${req.method} ${req.url} -> ${url}`);

        // Create a new headers object based on incoming request
        const headers = new Headers();
        req.headers.forEach((value, key) => {
            // Skip problematic headers
            if (['host', 'connection', 'content-length'].includes(key.toLowerCase())) return;
            headers.set(key, value);
        });

        // Authorization header specific handling if needed (Next sometimes strips it?)
        // But usually frontend sends Bearer token.

        const response = await fetch(url, {
            method: req.method,
            headers: headers,
            // For GET requests, body is undefined.
            // For other methods (POST, PUT), handle body?
            // But GET is specific to this export.
        });

        console.log(`[Proxy] Backend responded with status: ${response.status}`);

        // Forward the response
        // We stream the body directly if possible, or convert to blob/arrayBuffer
        const responseBody = await response.blob();

        // Create outgoing headers
        const responseHeaders = new Headers();
        response.headers.forEach((value, key) => {
            if (['content-encoding', 'content-length'].includes(key.toLowerCase())) return;
            responseHeaders.set(key, value);
        });

        return new NextResponse(responseBody, {
            status: response.status,
            headers: responseHeaders,
        });
    } catch (error: any) {
        console.error(`[Proxy] Error forwarding request:`, error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}

// We also need to handle other methods (POST, PUT, DELETE, PATCH)
// Since this is a catch-all route [...path], we can export a default handler or separate.
// In App Router, we export named functions for HTTP methods.

const handler = async (req: NextRequest, props: { params: Promise<{ path: string[] }> }) => {
    const params = await props.params;
    const backendUrl = process.env.INTERNAL_API_URL || 'http://backend:3001';

    try {
        const path = params.path ? params.path.join('/') : '';
        const searchParams = req.nextUrl.searchParams.toString();
        const url = `${backendUrl}/${path}${searchParams ? '?' + searchParams : ''}`;

        console.log(`[Proxy] Forwarding ${req.method} ${req.url} -> ${url}`);

        const headers = new Headers();
        req.headers.forEach((value, key) => {
            if (['host', 'connection', 'content-length'].includes(key.toLowerCase())) return;
            headers.set(key, value);
        });

        const body = ['GET', 'HEAD'].includes(req.method) ? undefined : await req.arrayBuffer(); // Read body if present

        const response = await fetch(url, {
            method: req.method,
            headers: headers,
            body: body,
            // Disable redirect following if desired? default is manual or follow.
        });

        console.log(`[Proxy] Backend responded with status: ${response.status}`);

        // Use text or blob depending on content type? Or just buffer.
        // ArrayBuffer is safest.

        const responseBody = await response.arrayBuffer();

        const responseHeaders = new Headers();
        response.headers.forEach((value, key) => {
            if (['content-encoding', 'content-length'].includes(key.toLowerCase())) return;
            responseHeaders.set(key, value);
        });

        return new NextResponse(responseBody, {
            status: response.status,
            headers: responseHeaders,
        });

    } catch (error: any) {
        console.error(`[Proxy] Error: ${error.message}`);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
};

export { handler as POST, handler as PUT, handler as DELETE, handler as PATCH, handler as HEAD };
