export default class PhotoService {
    getImages() {
        return fetch('media/data/photos.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }
}
