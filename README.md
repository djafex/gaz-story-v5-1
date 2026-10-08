# G@z Story Studio V5

Pipeline: idea -> creative bible -> storyboard -> asynchronous Agnes video jobs -> automatic polling -> browser-side master assembly.

## Deploy
1. Import this folder into Vercel.
2. Add `AGNES_API_KEY` as an environment variable.
3. Deploy.
4. Open the deployed URL.

## Important
Agnes video generation is asynchronous and currently returns short clips (4-12s for the 2.5 models). G@z therefore creates multiple clips and assembles them into a master in the browser. The browser must be able to fetch the returned Agnes video URLs (CORS). If an output host blocks browser fetches, use the official Agnes Studio/browser workflow or add a dedicated object-storage/proxy layer; do not expose the API key in the frontend.

The current public Agnes documentation confirms `POST /v1/videos`, polling via `GET /agnesapi?video_id=...&model_name=...`, and a completed result URL.

## Safe test order
1. Deploy with only AGNES_API_KEY configured.
2. Test the story endpoint first.
3. Generate ONE video clip.
4. Poll until completed and verify the returned URL.
5. Generate TWO clips.
6. Test browser assembly.
7. Only then run the full storyboard.

Do not publish the API key in the frontend or GitHub. Video generation is asynchronous; poll with video_id.
