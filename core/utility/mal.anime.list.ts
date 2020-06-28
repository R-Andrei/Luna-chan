import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';

import { AnimeRecord } from '../types';


const headers = {
    'Content-Type': 'application/json'
}

const baseUrl = 'https://myanimelist.net';

const getOldStyleAnime = async (url: string): Promise<Array<AnimeRecord>> =>
    new Promise((resolve, reject) => {
        axios({
            url,
            headers,
            method: 'get',
            params: {
                status: 2
            }
        })
            .then((response: AxiosResponse<any>) => {
                const page: CheerioStatic = cheerio.load(response.data);
                const animeLists: Cheerio = page('div#list_surround');
                const tableList: Array<CheerioElement> = animeLists.find('table').toArray();

                const animeList: Array<AnimeRecord> = tableList
                    .slice(3, tableList.length - 1)
                    .map((table: CheerioElement) => {
                        const title_id_match: Array<string> = /anime\/(\d+)\/(.*)/ig.exec(
                            table.childNodes[1].childNodes[0].childNodes[3].childNodes[3].attribs.href
                        );
                        const score_match: Array<string> = /score-(\d|na)/ig.exec(
                            table.childNodes[1].childNodes[0].childNodes[5].childNodes[1].attribs.class
                        );
                        return {
                            id: parseInt(title_id_match[1]),
                            title: title_id_match[2],
                            score: (score_match[1] !== 'na') ? parseInt(score_match[1]) : null,
                            cover: null
                        }
                    });
                resolve(animeList);
            })
            .catch((error: Error) => reject(error));
    });

const filterAnimeStats = (animeList: Array<AnimeRecord>): Array<AnimeRecord> =>
    animeList.map((anime: AnimeRecord) => {
        return {
            score: anime.score,
            title: anime.anime_title,
            id: anime.anime_id,
            cover: anime.anime_image_path,
        }
    });

export const gradeTranslator = (grade: number): string => {
    if (grade >= 9.2)
        return 'perfect';
    else if (grade < 9.2 && grade >= 7.5)
        return 'good';
    else if (grade < 7.5 && grade >= 6.8)
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

                const jsonTable: string = animeTable.attr('data-items');

                if (jsonTable !== undefined) {
                    const animeList: Array<AnimeRecord> = filterAnimeStats(JSON.parse(jsonTable))

                    resolve(animeList);
                }
                else
                    getOldStyleAnime(url)
                        .then((animeList: Array<AnimeRecord>) => {
                            resolve(animeList);
                        })
                        .catch((error: Error) => reject(error));
            })
            .catch(error => {
                reject(error);
            });
    });

export const compareAnimeLists = (fakeList: Array<AnimeRecord>, otherList: Array<AnimeRecord>): number => {

    const commonList: Array<AnimeRecord> = fakeList.reduce((prev: any, curr: AnimeRecord) => {
        const otherAnime: AnimeRecord = otherList.find((record: AnimeRecord) => record.id === curr.id);
        return (otherAnime !== undefined)
            ? (!otherAnime.score)
                ? prev
                : [
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
