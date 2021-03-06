import { FixturesResponseDto } from '../../api/dto/fixtures-response.dto';
import { PredictionDetailsDto } from '../../api/dto/prediction-details.dto';
import { CompetitionsIdsEnum } from '../../enums/competitions-ids.enum';
import { FixtureDto } from '../../api/dto/fixture.dto';
import { getMoscowTime, getToday } from '../../utils/dates/dates.utils';
import { DatePatternsEnum } from '../../enums/date-patterns.enum';
import { prepareAdvice } from '../../utils/predictions/predictions.utils';

const createFixturesListMessage = (
    fixturesByLeagues: FixturesResponseDto[],
    predictionsMap: Map<string, PredictionDetailsDto>,
): string => {
    const fixturesListTitle = getFixturesListTitle();
    const fixturesListView = createFixturesListView(fixturesByLeagues, predictionsMap);

    return `${fixturesListTitle}\n\n${fixturesListView}`;
};

const getFixturesListTitle = (): string => {
    return `<b>Матчи на ${getToday(DatePatternsEnum.RussianDatePattern)}</b>`;
};

const createFixturesListView = (
    fixturesByLeagues: FixturesResponseDto[],
    predictionsMap: Map<string, PredictionDetailsDto>,
): string => {
    const fixturesViews = fixturesByLeagues
        .map((item: FixturesResponseDto) => item.response)
        .flat()
        .sort((a: FixtureDto, b: FixtureDto) => {
            return Number(a.fixture?.timestamp) - Number(b.fixture?.timestamp);
        }).map((fixture: FixtureDto) => {
            const fixtureId = String(fixture.fixture?.id);
            const prediction = predictionsMap.has(fixtureId)
                ? predictionsMap.get(fixtureId)
                : undefined;

            return createFixtureView(fixture, prediction);
        });

    return fixturesViews.join('\n\n');
};

const createFixtureView = (
    fixtureData: FixtureDto,
    prediction: PredictionDetailsDto | undefined,
): string => {
    const { fixture, teams, league } = fixtureData;
    if (!fixture || !teams || !league || !prediction) {
        return '';
    }
    const { home, away } = teams;
    if (!home || !away) {
        return '';
    }

    const moscowTime = getMoscowTime(fixture.date);
    const leagueIcon = getLeagueEmoji(league?.id);
    const teamsTitle = `${leagueIcon}󠁥󠁮󠁧 <b>${home.name} vs ${away.name}</b> ${moscowTime}`;
    const preparedAdvice = prepareAdvice(fixtureData, prediction);
    const predictionView = preparedAdvice ? `Прогноз: ${preparedAdvice}` : '';

    return `${teamsTitle}\n${predictionView}`;
};

const getLeagueEmoji = (leagueId: number | null): string => {
    const leagueIdAsString = String(leagueId);
    switch (leagueIdAsString) {
    case CompetitionsIdsEnum.ChampionsLeagueId:
    case CompetitionsIdsEnum.EuropeLeagueId:
        return '🇪🇺';
    case CompetitionsIdsEnum.RussianLeagueId:
        return '🇷🇺';
    case CompetitionsIdsEnum.EnglandLeagueId:
        return '🏴󠁧󠁢󠁥󠁮󠁧󠁿';
    default:
        return '';
    }
};

export { createFixturesListMessage };