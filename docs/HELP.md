# Using GA4 Page Links

[Download the Chrome extension](https://github.com/martingaray/ga4-page-links/releases/latest/download/ga4-page-links.zip). Unzip it, open `chrome://extensions` in desktop Chrome 114+, enable **Developer mode**, and choose **Load unpacked**. Select the directory containing `manifest.json`. Reload any open Analytics tabs. Click the extension's toolbar icon to open its side panel; select **EN** for English. To update an existing installation, replace the files in the same folder and reload it.

1. **Links:** open a GA4 report with a page path dimension. Check the property ID shown in the panel, enter the site domain without a path and choose **Save and apply**. HTTPS is the default. Each **↗** opens the page in a new tab and preserves the original query.
2. **Accounts:** add a property by numeric ID (not a `G-…` measurement ID). Optionally give it a name. Find it by name, domain or ID. Editing affects only that record. Confirming **Remove property** also removes links in its open report tabs; it does not change the Google account.
3. **Audit:** open the [GA4 and GTM self-check](https://cookingmetrics.com/google-analytics-self-check/?utm_source=github&utm_medium=ga4-page-links#checklist), or jump to purchases, campaigns or configuration. It is a manual review. The panel does not pass property IDs, domains or report rows to the checklist.

**Multiple sites in one property:** add Hostname as a secondary dimension and enable per-row mode. When that column is present, rows with an invalid hostname are skipped. Without the column, links use the saved domain.

**Missing links?** Reload any Analytics tab that was open at installation time. Use a supported English or Spanish path dimension with complete paths that start with `/`. Totals, titles, screen classes and truncated values without a full tooltip do not receive links. Changes to GA4 markup may require an extension update. No account data needs to be shared to use the extension.

[CookingMetrics](https://cookingmetrics.com/?utm_source=github&utm_medium=ga4-page-links) · [Martín Garay](https://www.martingaray.com.ar/?utm_source=github&utm_medium=ga4-page-links) · [Español](AYUDA.md)
