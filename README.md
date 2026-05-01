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
`Electric power use`.

Controls:

- `Pause` / `Play` - pause or resume the animation
- `Reset` - restart the timeline
- `Daten waehlen` - load a new public dataset

The app currently uses World Bank Open Data without an API key. It adjusts the
requested period to the years that are actually available for the selected
indicator.
