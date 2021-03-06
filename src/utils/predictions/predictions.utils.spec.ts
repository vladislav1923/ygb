import { PredictionDetailsDto } from '../../api/dto/prediction-details.dto';
import { AWAY_TEAM_NAME_MOCK, FIXTURE_MOCK, HOME_TEAM_NAME_MOCK } from '../../mocks/fixtures.mocks';
import { prepareAdvice } from './predictions.utils';

describe('Predictions utils', () => {
    it('should prepare predictions', () => {
        const testMap = new Map<PredictionDetailsDto, string>()
            .set({ under_over: null, winner: { id: 0, name: AWAY_TEAM_NAME_MOCK }, advice: `Winner : ${AWAY_TEAM_NAME_MOCK}` }, 'Победитель 2')
            .set({ under_over: null, winner: { id: 0, name: HOME_TEAM_NAME_MOCK }, advice: `Winner : ${HOME_TEAM_NAME_MOCK}` }, 'Победитель 1')
            .set({ under_over: '+1.5', winner: { id: 0, name: HOME_TEAM_NAME_MOCK }, advice: `Combo Winner : ${HOME_TEAM_NAME_MOCK}` }, 'Победитель 1 и ТБ1.5')
            .set({ under_over: '-4.5', winner: { id: 0, name: AWAY_TEAM_NAME_MOCK }, advice: `Combo Winner : ${HOME_TEAM_NAME_MOCK}` }, 'Победитель 2 и ТМ4.5')
            .set({ under_over: null, winner: null, advice: `Double chance : ${HOME_TEAM_NAME_MOCK} or draw` }, '1X')
            .set({ under_over: null, winner: null, advice: `Double chance : draw or ${AWAY_TEAM_NAME_MOCK}` }, 'Х2')
            .set({ under_over: '-3.5', winner: null, advice: `Combo Double chance : ${HOME_TEAM_NAME_MOCK} or draw and -3.5 goals` }, '1X и ТМ3.5')
            .set({ under_over: '+1.5', winner: null, advice: `Combo Double chance : draw or ${AWAY_TEAM_NAME_MOCK} and +1.5 goals` }, 'Х2 и ТБ1.5');

        for (const [ prediction, expectedResult ] of testMap) {
            const result = prepareAdvice(FIXTURE_MOCK, prediction);

            expect(result).toBe(expectedResult);
        }
    });
});
