import { DEFAULT_REGION } from './songs/constants';

const uiTextByRegion = {
    'en-US': {
        controls: {
            language: 'Language',
            seed: 'Seed',
            randomSeed: 'Random seed',
            likesPerSong: 'Likes per song'
        },
        player: {
            playPreview: 'Play preview',
            stopPreview: 'Stop preview',
            lyrics: 'Lyrics'
        },
        views: {
            table: 'Table View',
            gallery: 'Gallery View'
        },
        table: {
            columns: ['', '#', 'Title', 'Artist', 'Album', 'Genre', 'Likes']
        },
        regions: {
            'en-US': 'English (USA)',
            'ru-RU': 'Russian (Russia)'
        },
        messages: {
            loadDataError: 'Failed to load data.',
            loadSongsError: 'Failed to load songs.'
        },
        song: {
            likes: 'likes',
            coverAlt: (title) => `${title} cover`
        }
    },
    'ru-RU': {
        controls: {
            language: 'Язык',
            seed: 'Сид',
            randomSeed: 'Случайный сид',
            likesPerSong: 'Количество лайков на песню'
        },
        player: {
            playPreview: 'Воспроизвести превью',
            stopPreview: 'Остановить превью',
            lyrics: 'Текст песни'
        },
        views: {
            table: 'Таблица',
            gallery: 'Галерея'
        },
        table: {
            columns: ['', '#', 'Название', 'Исполнитель', 'Альбом', 'Жанр', 'Лайки']
        },
        regions: {
            'en-US': 'Английский (США)',
            'ru-RU': 'Русский (Россия)'
        },
        messages: {
            loadDataError: 'Не удалось загрузить данные.',
            loadSongsError: 'Не удалось загрузить песни.'
        },
        song: {
            likes: 'лайков',
            coverAlt: (title) => `Обложка песни «${title}»`
        }
    }
};

export function getUiText(region) {
    return uiTextByRegion[region] ?? uiTextByRegion[DEFAULT_REGION];
}

export function getRegionOptions(uiText) {
    return Object.entries(uiText.regions).map(createRegionOption);
}

function createRegionOption([value, label]) {
    return { value, label };
}
