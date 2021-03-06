import { env, exit } from 'process';
import { getToday } from '../../utils/dates/dates.utils';
import { DataInterface } from '../../interfaces/data.interface';
import { AxiosRequestHeaders } from 'axios';
import { get } from '../base';
import { FixturesResponseDto } from '../dto/fixtures-response.dto';
import { getLeagueCacheKey } from '../../utils/cache/cache.utils';
import { getFromCache, setToCache } from '../../services/cache/cache.service';

const fetchFixturesByLeagueId = async (leagueId: string): Promise<FixturesResponseDto> => {
    const { RAPID_API_TOKEN, FOOTBALL_API_HOST, FOOTBALL_API_URL } = env;

    if (!RAPID_API_TOKEN || !FOOTBALL_API_HOST || !FOOTBALL_API_URL) {
        console.error('Env variables are not defined');
        exit(1);
    }

    const today = getToday();
    const cacheKey = getLeagueCacheKey(today, leagueId);
    const cacheData = await getFromCache(cacheKey);
    if (cacheData) {
        return JSON.parse(cacheData) as FixturesResponseDto;
    }

    const url = `${FOOTBALL_API_URL}/fixtures`;
    const params: DataInterface = {
        date: today,
        league: leagueId,
        season: '2021',
        timezone: 'Europe/Moscow',
    };
    const headers: AxiosRequestHeaders = {
        'x-rapidapi-host': FOOTBALL_API_HOST,
        'x-rapidapi-key': RAPID_API_TOKEN,
    };

    const response = await get<FixturesResponseDto>(url, FixturesResponseDto, params, headers);
    await setToCache(cacheKey, JSON.stringify(response));

    return response;
};

const fetchFixturesByLeaguesIds = async (leagueIds: string[]): Promise<FixturesResponseDto[]> => {
    return Promise.all([
        ...leagueIds.map((leagueId: string) => fetchFixturesByLeagueId(leagueId)),
    ]);
};

export { fetchFixturesByLeaguesIds, fetchFixturesByLeagueId };