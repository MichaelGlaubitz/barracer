# Bar Racer

Small browser-based bar chart race demo that can load public World Bank Open
Data time series from a built-in data dialog.

## Project Structure

- `index.html` - App shell and canvas mount point
- `src/styles.css` - Visual styling
- `src/main.js` - Chart animation, data dialog, and Open Data loading

## Run

Open `index.html` in a browser. Choose a dataset in the data dialog, for
example `GDP`, `Population`, `CO2 emissions`, `Internet users`, or
`Electric power use`. The dialog also includes a static open-reference example
for the most expensive football transfers of all time.

Controls:

- `Pause` / `Play` - pause or resume the animation
- `Reset` - restart the timeline
- `Daten waehlen` - load a new public dataset

The app currently uses World Bank Open Data without an API key for country
time series. It can also load the public Wikipedia list of most expensive
association football transfers, with bundled fallback data if the live table
cannot be parsed. Requested periods are adjusted to the years that are actually
available for the selected dataset.
