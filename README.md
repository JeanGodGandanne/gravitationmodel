# Masterarbeit

For technical instructions read chapters below.
This prototype displays the usage of the Huff model in store planning or location analysis processes.
Before starting you need to install dependencies via `npm install` in the same directory the package.json is located in.
In order start the project run `ng serve` or `npm start` or see *Development Server*.
Once the page is loaded you should see a map focused on Berlin with census areas and stores.
You can click every feature on the map which should open an object window with additional information for the feature.
If the feature is a store you can start calculating the Huff model for the selected store which then should colour the census areas accordingly.
In the lower left corner you should see two buttons.
On pushing the add button you should start the add-new-store-interaction in which you should be able to set a new store in the map inside Berlin.
On pushing he layer button you should see the layer manager in which you can change visbillity and z-index of all layers.

--------

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
