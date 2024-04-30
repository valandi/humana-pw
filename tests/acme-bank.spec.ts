import { test } from '@playwright/test';
import { BatchInfo, Configuration, EyesRunner, VisualGridRunner, BrowserType, DeviceName, ScreenOrientation, Eyes, Target } from '@applitools/eyes-playwright';

export let Batch: BatchInfo;
export let Config: Configuration;
export let Runner: EyesRunner;

test.beforeAll(async() => {

    // Configure Applitools SDK to run on the Ultrafast Grid
    Runner = new VisualGridRunner({ testConcurrency: 5 });
    Batch = new BatchInfo({name: `Humana Safari`});

    Config = new Configuration();
    Config.setBatch(Batch);
    Config.addBrowsers(
        { name: BrowserType.CHROME, width: 800, height: 600 },
        { name: BrowserType.FIREFOX, width: 1600, height: 1200 },
        { name: BrowserType.SAFARI, width: 1024, height: 768 },
        { name: BrowserType.SAFARI_ONE_VERSION_BACK, width: 1024, height: 768 },
        { chromeEmulationInfo: { deviceName: DeviceName.iPhone_11, screenOrientation: ScreenOrientation.PORTRAIT} },
        { chromeEmulationInfo: { deviceName: DeviceName.Nexus_10, screenOrientation: ScreenOrientation.LANDSCAPE} }
    )
});

test.describe('Humana Safari', () => {
    let eyes: Eyes;
    test.beforeEach(async ({ page }) => {
        eyes = new Eyes(Runner, Config);

        // Start Applitools Visual AI Test
        // Args: Playwright Page, App Name, Test Name, Viewport Size for local driver
        await eyes.open(page, 'Humana Safari', `Humana Safari`, { width: 1200, height: 600 })
    });
    
    test('log into a bank account', async ({ page }) => {
        await page.goto('https://www.humana.com/home-care');

        // Full Page - Visual AI Assertion
        await eyes.check('Main page', Target.window().fully());
    });

    test.afterEach(async () => {
        await eyes.close();
    });
});

test.afterAll(async() => {
    const results = await Runner.getAllTestResults();
    console.log('Visual test results', results);
});