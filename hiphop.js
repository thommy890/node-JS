const fs = require('fs');
const requestPromise = require('request-promise');

const fetchFavoriteAlbums = async () => {
    try {
        // Fetch data from the provided URL
        let response = await requestPromise('https://lukes-projects.herokuapp.com/v1/hiphop');
        response = JSON.parse(response); // Parse the response to get a JSON object
        
        console.log('Received response:', response); // Log the response to inspect its structure
        
        // Assuming the response is an array, extract artist, album, and id from each album
        const albums = response.map(album => ({
            artist: album.artist,
            album: album.album,
            id: album.id
        }));

        // Write the extracted albums to favorite-albums.json
        fs.writeFileSync('favorite-albums.json', JSON.stringify(albums, null, 2), 'utf-8');
        console.log('Favorite albums have been saved to favorite-albums.json');

    } catch (error) {
        console.error('Error fetching or processing data:', error.message);
    }
};

fetchFavoriteAlbums();
