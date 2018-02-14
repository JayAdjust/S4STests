export const Quick = {
    GoToQuick: async() => {
        await page.hover(".menu-item.active.hover-over.shipping");
        await page.waitForSelector(".sub-routes div:nth-child(3)");
        await page.click(".sub-routes div:nth-child(3)");
    },
    
    Setup: (_page, _browser) => {
        page = _page;
        browser = _browser;
        return (page != null && browser != null);
    }
}