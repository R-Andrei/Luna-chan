import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';

import { AnimeRecord } from '../types';


const headers = {
    'Content-Type': 'application/json'
}

const baseUrl = 'https://myanimelist.net';

export const gradeTranslator = (grade: number): string => {
    if (grade >= 9.5)
        return 'perfect';
    else if (grade < 9.5 && grade > 8)
        return 'good';
    else if (grade < 8 && grade > 7)
        return 'neutral';
    else
        return 'bad';
}

export const getAnimeList = async (args: string[]): Promise<Array<AnimeRecord>> =>
    new Promise((resolve, reject) => {
        const profile: string = args[0];

        const url: string = (profile.includes('myanimelist.net'))
            ? `${profile.split('profile').join('animelist')}?status=2`
            : `${baseUrl}/animelist/${profile}?status=2`;

        axios({
            url,
            method: 'get',
            headers: headers,
            params: {
                status: 2
            }
        })
            .then((response: AxiosResponse<any>) => {
                const page: CheerioStatic = cheerio.load(response.data);
                const animeTable: Cheerio = page('table.list-table');

                const animeList: Array<AnimeRecord> = JSON.parse(animeTable.attr('data-items'))
                    .map((anime: AnimeRecord) => {
                        return {
                            score: anime.score,
                            title: anime.anime_title,
                            id: anime.anime_id,
                            cover: anime.anime_image_path,
                        }
                    });
                resolve(animeList);
            })
            .catch(error => {
                reject(error);
            });
    });

export const compareAnimeLists = (fakeList: Array<AnimeRecord>, otherList: Array<AnimeRecord>): number => {

    const commonList: Array<AnimeRecord> = fakeList.reduce((prev: any, curr: AnimeRecord) => {
        const otherAnime: AnimeRecord = otherList.find((record: AnimeRecord) => record.id === curr.id);
        return (otherAnime !== undefined)
            ? [
                ...prev,
                {
                    ...curr,
                    other_score: otherAnime.score
                }
            ]
            : prev;
    }, []);

    const grade: number = commonList.reduce((prev: number, curr: AnimeRecord) => {
        const difference: number = Math.abs(curr.score - curr.other_score);
        return (curr.score !== curr.other_score)
            ? (difference > 5)
                ? prev + 0
                : prev + 1 - (difference * 0.2)
            : prev + 1;
    }, 0);
    return grade / commonList.length * 10;
}