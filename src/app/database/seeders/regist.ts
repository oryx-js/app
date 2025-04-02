import Common from '@core/system/common';

/** don't forget to register your seed here */
export default async function runSeeders() {
    if (Common.env<string>('DB_SEED', 'off') === 'on') {
        // await SampleSeed();
    }
}
