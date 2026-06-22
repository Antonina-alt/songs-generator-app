import { fakerEN_US, fakerRU } from '@faker-js/faker';

export function getFaker(region) {
    return region === 'ru-RU' ? fakerRU : fakerEN_US;
}
