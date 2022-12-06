# nhsuk-header-search

This component can be used to add a search box to an HTML page. The primary use of this is to provide a search box to use with [nhsuk.site-search](https://dev.azure.com/nhsuk/nhsuk.site-search)

## Quickstart

### Install Locally
To install this component locally
```bash
npm i nhsuk-header-search
```

## Usage
An example of how the JavaScript and CSS for this control can be used, look at `nhsuk-header-search/app/index.html`

## Dependencies
The dependencies for this component are listed in the `package.json` file

## Contributing

### Development
Clone this repository
```bash
git clone https://github.com/nhsuk/nhsuk-header-search.git nhsuk-header-search
```
 
 Change directory in to the folder where the repository has just been cloned.
 ```bash
 cd nhsuk-header-search
 ```

Install all of the dependencies
```bash
npm install
```

Run the development server
```bash
npm start
```
A test site will be available at http://localhost:3000.

### Tests
NB There are currently no automated tests associated with this project.
To perform linting
```bash
npm run lint
```

### Publication
Publication of the npm package is preformed by GitHub action. Details of the GitHub action can be found in `nhsuk-header-search/.github/workflows/release.yml`