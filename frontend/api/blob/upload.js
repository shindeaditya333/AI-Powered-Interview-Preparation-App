import { handleUpload } from "@vercel/blob/client";

export default async function handler(request, response) {
    if (request.method !== "POST") {
        return response.status(405).json({
            error: "Method not allowed",
        });
    }

    try {
        const body = await request.json();

        const jsonResponse = await handleUpload({
            body,
            request,

            onBeforeGenerateToken: async (pathname) => {
                return {
                    allowedContentTypes: [
                        "video/webm",
                    ],
                    addRandomSuffix: true,
                    tokenPayload: JSON.stringify({
                        type: "video-interview",
                    }),
                };
            },

            onUploadCompleted: async ({
                                          blob,
                                          tokenPayload,
                                      }) => {
                console.log(
                    "Video uploaded to Blob:",
                    blob.url
                );
            },
        });

        return response.status(200).json(
            jsonResponse
        );

    } catch (error) {

        console.error(
            "Blob upload error:",
            error
        );

        return response.status(400).json({
            error:
                error instanceof Error
                    ? error.message
                    : "Blob upload failed",
        });
    }
}