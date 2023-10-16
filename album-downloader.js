const fs = require('fs');
const path = require('path');
const requestPromise = require('request-promise');

const DOWNLOADS_DIR = path.join(__dirname, 'downloads');

const fetchAndDownloadAlbums = async () => {
    try {
        const albumsResponse = await requestPromise('https://lukes-projects.herokuapp.com/v1/hiphop');
        console.log('Received response:', albumsResponse); // Log the response to inspect its structure

        const parsedResponse = JSON.parse(albumsResponse);
        const albums = parsedResponse.result;

        // Check if albums is actually an array before iterating
        if (!Array.isArray(albums)) {
            console.error('Unexpected response structure. Albums data is not an array.');
            return;
        }

        for (let album of albums) {
            // Extract necessary data from the album
            const { id, thumbnail_image: thumbnail } = album;

            // Download thumbnail image
            const thumbnailData = await requestPromise({
                url: thumbnail,
                encoding: 'base64'
            });
            const thumbnailExtension = path.extname(new URL(thumbnail).pathname);
            fs.writeFileSync(path.join(DOWNLOADS_DIR, `${id}_thumbnail${thumbnailExtension}`), thumbnailData, 'base64');

            console.log(`Downloaded assets for album ID: ${id}`);
        }

        console.log('Finished downloading all albums assets.');

    } catch (error) {
        console.error('Error:', error.message);
    }
};

fetchAndDownloadAlbums();
